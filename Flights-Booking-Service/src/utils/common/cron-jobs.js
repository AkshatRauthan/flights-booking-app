const cron = require('node-cron');
const { Logger } = require('../../config');

function scheduleCrons(){
    cron.schedule('*/5 * * * *', async () => {
        const { BookingService } = require("../../services");
        const response = await BookingService.cancelOldBookings();
        Logger.info(`Cron job result: ${JSON.stringify(response)}`);
    });
}

module.exports = scheduleCrons;