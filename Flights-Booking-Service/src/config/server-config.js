const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    API_GATEWAY: process.env.API_GATEWAY,
    FLIGHT_SERVICE: process.env.FLIGHT_SERVICE,
    RABBITMQ_HOST: process.env.RABBITMQ_HOST,
    RABBITMQ_USERNAME: process.env.RABBITMQ_USERNAME,
    RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
    RABBITMQ_QUEUE_NAME: process.env.RABBITMQ_QUEUE_NAME,
}