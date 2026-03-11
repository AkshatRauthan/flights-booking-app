const amqplib = require("amqplib");

const { RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOST, AIRLINE_ADMIN_RES_QUEUE, AIRLINE_ADMIN_REQ_QUEUE } = require("./server-config")
const Logger = require('./logger-config');
let connection, channel;

async function connectQueue(){
    try {
        connection = await amqplib.connect(`amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}`);
        channel = await connection.createChannel();
        await channel.assertQueue(AIRLINE_ADMIN_REQ_QUEUE);
        await channel.assertQueue(AIRLINE_ADMIN_RES_QUEUE);
        Logger.info("Listening for requests");
        channel.consume(AIRLINE_ADMIN_REQ_QUEUE, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                Logger.info(`Received message: ${JSON.stringify(data)}`);
                await generateUser(data, msg);
            }
        });
    } catch (error) {
        Logger.error(error);
        throw error;
    }   
}

async function sendData(data, queueName){
    try {
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        Logger.error(error);
        throw error;
    }
}

async function generateUser(data, msg){
    Logger.info("Queue Recieved Successfully");
    Logger.info(`Queue data: ${JSON.stringify(data)}`);
    Logger.info("Generating User");

    let res = {data : {
        ...data,
        userId: 100,
    }}

    Logger.info("Sending Response to Queue");
    await sendData(data, AIRLINE_ADMIN_RES_QUEUE);
    Logger.info("Response Sent Successfully");
    channel.ack(msg);
}

module.exports = {
    connectQueue,
    sendData,
}