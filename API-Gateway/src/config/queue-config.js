const amqplib = require("amqplib");

const { RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOST, AIRLINE_ADMIN_RES_QUEUE, AIRLINE_ADMIN_REQ_QUEUE } = require("./server-config")
let connection, channel;

async function connectQueue(){
    try {
        connection = await amqplib.connect(`amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}`);
        channel = await connection.createChannel();
        await channel.assertQueue(AIRLINE_ADMIN_REQ_QUEUE);
        await channel.assertQueue(AIRLINE_ADMIN_RES_QUEUE);
        console.log("Listening for requests");
        channel.consume(AIRLINE_ADMIN_REQ_QUEUE, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log("Received message:", data);
                await generateUser(data, msg);
            }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }   
}

async function sendData(data, queueName){
    try {
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function generateUser(data, msg){
    console.log("Queue Recieved Successfully");
    console.log(data);
    console.log("Generating User");

    let res = {data : {
        ...data,
        userId: 100,
    }}

    console.log("Sending Response to Queue");
    await sendData(data, AIRLINE_ADMIN_RES_QUEUE);
    console.log("Response Sent Successfully");
    channel.ack(msg);
}

module.exports = {
    connectQueue,
    sendData,
}