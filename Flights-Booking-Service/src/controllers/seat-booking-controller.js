const { StatusCodes } = require('http-status-codes');
const { createSuccessResponse, createErrorResponse } = require('../utils/common');
const { SeatBookingService } = require('../services');

async function createSeatBooking(req, res) {
    try {
        const response = await SeatBookingService.createSeatBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            selectedSeats: req.body.selectedSeats
        })
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, "All the selected seats are available."));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

module.exports = {
    createSeatBooking,
}