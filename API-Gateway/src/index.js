const express = require("express");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

const { ServerConfig, Logger, RedisConfig } = require("./config");
const apiRoutes = require("./routes");
const { globalErrorHandler, notFoundHandler } = require("./middlewares/error-handler");

const { createProxyMiddleware } = require('http-proxy-middleware');
const { FLIGHT_BOOKING_SERVICE, FLIGHT_CREATION_SERVICE, FLIGHT_SEARCHING_SERVICE } = require("./config/server-config");
const { correlationId } = require('./middlewares/correlation-id');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(xss());

// Correlation ID
app.use(correlationId);

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: { success: false, message: 'Too many requests, please try again later.' }
});

// Proxy middleware (before body parsers)
app.use('/flightsCreationService', createProxyMiddleware({
    target: FLIGHT_CREATION_SERVICE,
    changeOrigin: true,
}));

app.use('/flightsSearchingService', createProxyMiddleware({
    target: FLIGHT_SEARCHING_SERVICE,
    changeOrigin: true,
}));

app.use('/flightsBookingsService', createProxyMiddleware({
    target: FLIGHT_BOOKING_SERVICE,
    changeOrigin: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter
app.use(limiter);

// Health check
app.get('/health', async (req, res) => {
    const checks = { status: 'ok', service: 'api-gateway', uptime: process.uptime(), timestamp: new Date().toISOString() };
    try {
        const redis = RedisConfig.getRedisClient();
        await redis.ping();
        checks.redis = 'connected';
    } catch (e) {
        checks.redis = 'disconnected';
        checks.status = 'degraded';
    }
    const statusCode = checks.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(checks);
});

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

if (require.main === module) {
    const server = app.listen(ServerConfig.PORT, () => {
        Logger.info(`API Gateway started on port ${ServerConfig.PORT}`);
    });

    // Graceful shutdown
    async function gracefulShutdown(signal) {
        Logger.info(`${signal} received. Shutting down gracefully...`);
        await RedisConfig.closeRedis();
        Logger.info('Redis connection closed.');
        server.close(() => {
            Logger.info('HTTP server closed.');
            process.exit(0);
        });
        setTimeout(() => {
            Logger.error('Forcefully shutting down...');
            process.exit(1);
        }, 10000);
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

module.exports = app;

