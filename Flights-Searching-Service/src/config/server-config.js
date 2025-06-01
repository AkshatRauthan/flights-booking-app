const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    FLIGHT_BOOKING_SERVICE: process.env.FLIGHT_BOOKING_SERVICE,
    FLIGHT_CREATION_SERVICE: process.env.FLIGHT_CREATION_SERVICE,
    API_GATEWAY: process.env.API_GATEWAY,
}