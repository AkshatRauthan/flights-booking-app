const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    BOOKING_SERVICE: process.env.BOOKING_SERVICE,
    FLIGHT_CREATION_SERVICE: process.env.FLIGHT_CREATION_SERVICE,
    FLIGHT_SEARCHING_SERVICE: process.env.FLIGHT_SEARCHING_SERVICE,
    FLIGHT_BOOKING_SERVICE: process.env.FLIGHT_BOOKING_SERVICE,
}
