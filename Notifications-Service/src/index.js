const express = require("express");
const amqplib = require("amqplib");
const cron = require('node-cron');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

const { ServerConfig, Logger } = require("./config");
const { EmailService } = require("./services");
const apiRoutes = require("./routes");
const { globalErrorHandler, notFoundHandler } = require("./middlewares/error-handler");
const { correlationId } = require('./middlewares/correlation-id');

const { GMAIL_EMAIL, RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOST } = ServerConfig;

const app = express();

app.use(helmet());
app.use(cors());
app.use(xss());

// Correlation ID
app.use(correlationId);

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
            let ticket;
            try {
                ticket = await EmailService.createTicket({
                    subject: object.subject,
                    content: object.content,
                    recipientEmail: object.recipientEmail,
                });
                await EmailService.sendEmail(GMAIL_EMAIL, object.recipientEmail, object.subject, object.content);
                await ticket.update({ status: 'success' });
                channel.ack(data);
                Logger.info(`Email sent successfully to: ${object.recipientEmail}`);
            } catch (error) {
                Logger.error(`Failed to send email to ${object.recipientEmail}: ${error.message}`);
                if (ticket) {
                    await ticket.update({ status: 'failed' });
                }
                channel.nack(data, false, false); // Don't requeue; cron will retry failed emails
            }
        });
    } catch (error) {
        Logger.error(`Failed to connect to RabbitMQ: ${error.message}`);
        throw error;
    }
}

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'notifications-service', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

const server = app.listen(ServerConfig.PORT, async () => {
    Logger.info(`Notifications Service started on port ${ServerConfig.PORT}`);
    await connectQueue();
    Logger.info("Connected to RabbitMQ notification queue");

    // Retry failed emails every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        Logger.info('Running failed email retry cron');
        const count = await EmailService.retryFailedEmails();
        Logger.info(`Retried ${count} failed emails`);
    });
    Logger.info('Failed email retry cron scheduled (every 10 minutes)');
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