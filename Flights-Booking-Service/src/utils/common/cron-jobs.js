const cron = require('node-cron');

function scheduleCrons(){
    cron.schedule('*/5 * * * *', async () => {
        const { BookingService } = require("../../services");
        const response = await BookingService.cancelOldBookings();
        console.log(response);
    });
}

module.exports = scheduleCrons;