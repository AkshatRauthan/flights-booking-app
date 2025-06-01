const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { BookingService } = require('../services');
const inMemDb = {};

async function createBooking(req, res) {
    console.log("\n");
    console.log(req.body);
    req.body.selectedSeats = JSON.parse(req.body.selectedSeats);
    console.log(req.body.selectedSeats);
    console.log(typeof req.body.selectedSeats);
    console.log(typeof req.body.selectedSeats[0]);
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats,
            selectedSeats: req.body.selectedSeats
        });
        SuccessResponse.data = response;
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

async function makePayment(req, res) {
    try {
        console.log("Hello");
        const idempotencyKey = req.headers['x-idempotency-key'];
        console.log("Idempotency Key :",idempotencyKey);
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
        SuccessResponse.data = response;
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

async function isValidBooking(req, res) {
    try {
        const id = req.body.id;
        const isValid = await BookingService.isValidBooking(id);
        SuccessResponse.message = isValid ? "Requested booking is valid" : "Requested booking is not valid";
        SuccessResponse.data = { 
            isValid: isValid,
        }
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error){
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function cancelOldBookings(req, res){
    try {
        const response = await BookingService.cancelOldBookings();
        SuccessResponse.data = response;
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
    createBooking,
    makePayment,
    isValidBooking,
    cancelOldBookings,
}