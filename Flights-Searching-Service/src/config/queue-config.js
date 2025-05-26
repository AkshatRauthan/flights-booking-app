const amqplib = require("amqplib");

const { RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOST, RABBITMQ_QUEUE_NAME } = require("./server-config")
let connection, channel;

async function connectQueue(){
    try {
        connection = await amqplib.connect(`amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}`);
        channel = await connection.createChannel();
        await channel.assertQueue(RABBITMQ_QUEUE_NAME);
    } catch (error) {  
        console.log(error);
        throw error;
    }   
}

async function sendData(data){
    try {
        await channel.sendToQueue(RABBITMQ_QUEUE_NAME, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    connectQueue,
    sendData,
}