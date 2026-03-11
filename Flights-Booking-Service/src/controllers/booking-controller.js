const { StatusCodes } = require('http-status-codes');
const { createSuccessResponse, createErrorResponse } = require('../utils/common');
const { BookingService } = require('../services');
const { Logger, RedisConfig } = require('../config');

async function createBooking(req, res) {
    Logger.info(`Create booking request received`);
    req.body.selectedSeats = JSON.parse(req.body.selectedSeats);
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
        if (!idempotencyKey){
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'The Idempotency Key is missing from request.'});
        }
        const redis = RedisConfig.getRedisClient();
        const redisKey = `idempotency:${idempotencyKey}`;
        const wasSet = await redis.set(redisKey, '1', 'EX', 300, 'NX');
        if (!wasSet) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'The request is already been processed. Please do not retry'});
        }
        const response = await BookingService.makePayment({
            bookingId: req.body.bookingId,
            userId: req.body.userId,
            totalCost: req.body.totalCost,
        })
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

async function getUserBookings(req, res) {
    try {
        const userId = req.params.userId;
        const bookings = await BookingService.getUserBookings(userId);
        return res.status(StatusCodes.OK).json(createSuccessResponse(bookings));
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            createErrorResponse(error, error.message)
        );
    }
}

async function cancelBooking(req, res) {
    try {
        const { bookingId } = req.body;
        const userId = req.headers['x-user-id'];
        const booking = await BookingService.cancelUserBooking(bookingId, userId);
        return res.status(StatusCodes.OK).json(createSuccessResponse(booking, 'Booking cancelled successfully'));
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            createErrorResponse(error, error.message)
        );
    }
}

module.exports = {
    createBooking,
    makePayment,
    isValidBooking,
    cancelOldBookings,
    getUserBookings,
    cancelBooking,
}