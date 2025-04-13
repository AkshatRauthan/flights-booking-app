const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    FLIGHTS_SERVICE: process.env.FLIGHTS_SERVICE,
    BOOKING_SERVICE: process.env.BOOKING_SERVICE,
}