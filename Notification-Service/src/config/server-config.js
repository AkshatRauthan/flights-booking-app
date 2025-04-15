const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    GMAIL_PASS: process.env.GMAIL_PASS,
    GMAIL_EMAIL: process.env.GMAIL_EMAIL,
    RABBITMQ_USERNAME: process.env.RABBITMQ_USERNAME,
    RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
}