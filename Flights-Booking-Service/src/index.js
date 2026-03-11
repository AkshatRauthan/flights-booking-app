const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

const { ServerConfig, Logger, Queue, RedisConfig } = require("./config");
const apiRoutes = require("./routes");
const { CRONS } = require('./utils/common');
const { globalErrorHandler, notFoundHandler } = require("./middlewares/error-handler");
const { correlationId } = require('./middlewares/correlation-id');

const app = express();

app.use(helmet());
app.use(cors());
app.use(xss());

// Correlation ID
app.use(correlationId);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req, res) => {
    const checks = { status: 'ok', service: 'flights-booking-service', uptime: process.uptime(), timestamp: new Date().toISOString() };
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

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

if (require.main === module) {
    const server = app.listen(ServerConfig.PORT, async () => {
        Logger.info(`Flights Booking Service started on port ${ServerConfig.PORT}`);
        CRONS();
        await Queue.connectQueue();
        Logger.info('RabbitMQ queue connected');
    });

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

