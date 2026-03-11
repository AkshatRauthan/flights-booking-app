const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");
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

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'flights-creation-service', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

if (require.main === module) {
    const server = app.listen(ServerConfig.PORT, () => {
        Logger.info(`Flights Creation Service started on port ${ServerConfig.PORT}`);
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
}

module.exports = app;

