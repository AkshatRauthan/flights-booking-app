const express = require("express");
const amqplib = require("amqplib");

const { ServerConfig, Logger } = require("./config")
const { EmailService } = require("./services")
const apiRoutes = require("./routes");

const { GMAIL_EMAIL, RABBITMQ_USERNAME, RABBITMQ_PASSWORD } = ServerConfig;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectQueue(){
    try { // Implementing Pub-Sub (Publisher-Subscriber) Model using RabbitMQ For Notification By Implementing Messaging Queues
        const connection = await amqplib.connect(`amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@localhost`); 
        const channel = await connection.createChannel();
        await channel.assertQueue("notification-queue");
        i = 0
        channel.consume("notification-queue", async (data) => {
            const object = JSON.parse(`${Buffer.from(data.content)}`); // Converting Buffer to String And then Parsing it to JSON Object Type
            console.log("Object :",i++);
            console.log(object);
            await EmailService.sendEmail(GMAIL_EMAIL, object.recipientEmail, object.subject, object.content); 
            channel.ack(data); // To remove the current message from queue as it is now processed or comsumed
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`\nSuccessfully started the server on port ${ServerConfig.PORT}`);
    await connectQueue();
    console.log("Connected To Queue");
}); 