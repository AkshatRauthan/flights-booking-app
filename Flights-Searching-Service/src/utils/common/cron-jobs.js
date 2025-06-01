const cron = require('node-cron');
const axios = require('axios');
const { FLIGHT_BOOKING_SERVICE } = require("./../../config/server-config");


function scheduleCrons(){
    cron.schedule('*/5 * * * *', async () => {
        console.log(`Cron initiated`);
        const response = await axios.post(`${FLIGHT_BOOKING_SERVICE}/api/v1/bookings/cancel`);
        console.log(response);
    });
}

module.exports = {
    scheduleCrons
};