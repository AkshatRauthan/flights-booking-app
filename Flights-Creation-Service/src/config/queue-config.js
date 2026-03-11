const amqplib = require("amqplib");

const { RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOST, AIRLINE_ADMIN_REQ_QUEUE, AIRLINE_ADMIN_RES_QUEUE } = require("./server-config")
const Logger = require('./logger-config');
let connection, channel;

async function connectQueue(){
    try {
        connection = await amqplib.connect(`amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}`);
        channel = await connection.createChannel();
        await channel.assertQueue(AIRLINE_ADMIN_REQ_QUEUE);
        await channel.assertQueue(AIRLINE_ADMIN_RES_QUEUE);
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

async function createAirlineAdminReq(data){
    try {
        const reqId = data.reqId;
        const email = data.email;
        const password = data.password;
        const isAirlineAdmin = data.isAirlineAdmin;
        await sendData({
            data: {
                reqId: reqId,
                email: email,
                password: password,
                isAirlineAdmin: isAirlineAdmin
            }
        }, AIRLINE_ADMIN_REQ_QUEUE);
        Logger.info("Data sent successfully");
        await getAirlineAdminRes(reqId);
        Logger.info("Process Completed");
    } catch (error) {
        Logger.error(error);
        throw error;
    }
}

async function getAirlineAdminRes(reqId) {
    try {
        return new Promise((resolve, reject) => {
            channel.consume(AIRLINE_ADMIN_RES_QUEUE, (msg) => {
                if (msg !== null) {
                    const data = JSON.parse(msg.content.toString());
                    if (data.data.reqId === reqId) {
                        channel.ack(msg);
                        Logger.info("Data Received");
                        Logger.info(`Queue response data: ${JSON.stringify(data)}`);
                        resolve(data);
                    } else {
                        channel.nack(msg);
                    }
                } else {
                    reject(new Error("No message received"));
                }
            });
        });
    } catch (error) {
        Logger.error(error);
        throw error;
    }
}

module.exports = {
    connectQueue,
    sendData,
    createAirlineAdminReq,
    getAirlineAdminRes
}