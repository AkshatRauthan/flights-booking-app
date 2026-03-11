const express = require("express");
const helmet = require('helmet');
const cors = require('cors');

const { ServerConfig, Logger, Queue } = require("./config");
const apiRoutes = require("./routes");
const { CRONS } = require('./utils/common');
const { globalErrorHandler, notFoundHandler } = require("./middlewares/error-handler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'flights-booking-service', timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

const server = app.listen(ServerConfig.PORT, async () => {
    Logger.info(`Flights Booking Service started on port ${ServerConfig.PORT}`);
    CRONS();
    await Queue.connectQueue();
    Logger.info('RabbitMQ queue connected');
});

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

