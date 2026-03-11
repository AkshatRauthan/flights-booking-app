const express = require("express");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");
const { globalErrorHandler, notFoundHandler } = require("./middlewares/error-handler");

const { createProxyMiddleware } = require('http-proxy-middleware');
const { FLIGHT_BOOKING_SERVICE, FLIGHT_CREATION_SERVICE, FLIGHT_SEARCHING_SERVICE } = require("./config/server-config");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

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
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'api-gateway', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

const server = app.listen(ServerConfig.PORT, () => {
    Logger.info(`API Gateway started on port ${ServerConfig.PORT}`);
});

// Graceful shutdown
function gracefulShutdown(signal) {
    Logger.info(`${signal} received. Shutting down gracefully...`);
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

