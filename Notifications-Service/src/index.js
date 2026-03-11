const express = require("express");
const amqplib = require("amqplib");
const helmet = require('helmet');
const cors = require('cors');

const { ServerConfig, Logger } = require("./config");
const { EmailService } = require("./services");
const apiRoutes = require("./routes");
const { globalErrorHandler, notFoundHandler } = require("./middlewares/error-handler");

const { GMAIL_EMAIL, RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOST } = ServerConfig;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectQueue() {
    try {
        const connection = await amqplib.connect(`amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST || 'localhost'}`);
        const channel = await connection.createChannel();
        await channel.assertQueue("notification-queue");

        channel.consume("notification-queue", async (data) => {
            const object = JSON.parse(Buffer.from(data.content).toString());
            Logger.info(`Processing notification for: ${object.recipientEmail}`);
            try {
                await EmailService.sendEmail(GMAIL_EMAIL, object.recipientEmail, object.subject, object.content);
                channel.ack(data);
                Logger.info(`Email sent successfully to: ${object.recipientEmail}`);
            } catch (error) {
                Logger.error(`Failed to send email to ${object.recipientEmail}: ${error.message}`);
                channel.nack(data, false, true); // Requeue on failure
            }
        });
    } catch (error) {
        Logger.error(`Failed to connect to RabbitMQ: ${error.message}`);
        throw error;
    }
}

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'notifications-service', timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

const server = app.listen(ServerConfig.PORT, async () => {
    Logger.info(`Notifications Service started on port ${ServerConfig.PORT}`);
    await connectQueue();
    Logger.info("Connected to RabbitMQ notification queue");
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