const { StatusCodes } = require('http-status-codes');
const { createSuccessResponse, createErrorResponse } = require('../utils/common');
const { BookingService } = require('../services');
const { Logger } = require('../config');
const inMemDb = {};

async function createBooking(req, res) {
    Logger.info(`Create booking request received`);
    Logger.info(`Request body: ${JSON.stringify(req.body)}`);
    req.body.selectedSeats = JSON.parse(req.body.selectedSeats);
    Logger.info(`Selected seats: ${JSON.stringify(req.body.selectedSeats)}`);
    Logger.info(`Selected seats type: ${typeof req.body.selectedSeats}`);
    Logger.info(`First seat type: ${typeof req.body.selectedSeats[0]}`);
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats,
            selectedSeats: req.body.selectedSeats
        });
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

async function makePayment(req, res) {
    try {
        Logger.info("Processing payment request");
        const idempotencyKey = req.headers['x-idempotency-key'];
        Logger.info(`Idempotency Key: ${idempotencyKey}`);
        if (!idempotencyKey){
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'The Idempotency Key is missing from request.'});
        }
        if (inMemDb[idempotencyKey]){
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'The request is already been processed. Please do not retry'});
        }
        const response = await BookingService.makePayment({
            bookingId: req.body.bookingId,
            userId: req.body.userId,
            totalCost: req.body.totalCost,
        })
        inMemDb[idempotencyKey] = idempotencyKey;
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

async function isValidBooking(req, res) {
    try {
        const id = req.body.id;
        const isValid = await BookingService.isValidBooking(id);
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(
                    { isValid: isValid },
                    isValid ? "Requested booking is valid" : "Requested booking is not valid"
                ));
    } catch (error){
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

async function cancelOldBookings(req, res){
    try {
        const response = await BookingService.cancelOldBookings();
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

module.exports = {
    createBooking,
    makePayment,
    isValidBooking,
    cancelOldBookings,
}