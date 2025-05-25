const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { SeatBookingService } = require('../services');

async function createSeatBooking(req, res) {
    try {
        const response = await SeatBookingService.createSeatBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            selectedSeats: req.body.selectedSeats
        });
        SuccessResponse.data = response;
        SuccessResponse.message = "All the selected seats are available.";
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    createSeatBooking,
}