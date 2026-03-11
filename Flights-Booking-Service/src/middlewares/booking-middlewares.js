const { StatusCodes } = require('http-status-codes');
const { createErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

function validateCreateBooking(req, res, next) {
    const errors = [];
    if (!req.body.flightId) errors.push('flightId is required');
    if (!req.body.userId) errors.push('userId is required');
    if (!req.body.noOfSeats) errors.push('noOfSeats is required');
    if (!req.body.selectedSeats) errors.push('selectedSeats is required');

    if (req.body.noOfSeats && (!Number.isInteger(Number(req.body.noOfSeats)) || Number(req.body.noOfSeats) < 1)) {
        errors.push('noOfSeats must be a positive integer');
    }

    if (errors.length > 0) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(createErrorResponse(new AppError(errors, StatusCodes.BAD_REQUEST), 'Invalid booking request'));
    }
    next();
}

function validateMakePayment(req, res, next) {
    const errors = [];
    if (!req.body.bookingId) errors.push('bookingId is required');
    if (!req.body.userId) errors.push('userId is required');
    if (!req.body.totalCost) errors.push('totalCost is required');
    if (!req.headers['x-idempotency-key']) errors.push('x-idempotency-key header is required');

    if (req.body.totalCost && isNaN(Number(req.body.totalCost))) {
        errors.push('totalCost must be a valid number');
    }

    if (errors.length > 0) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(createErrorResponse(new AppError(errors, StatusCodes.BAD_REQUEST), 'Invalid payment request'));
    }
    next();
}

function validateSeatBooking(req, res, next) {
    const errors = [];
    if (!req.body.flightId) errors.push('flightId is required');
    if (!req.body.userId) errors.push('userId is required');
    if (!req.body.selectedSeats) errors.push('selectedSeats is required');

    if (req.body.selectedSeats && !Array.isArray(req.body.selectedSeats)) {
        errors.push('selectedSeats must be an array');
    }

    if (req.body.selectedSeats && Array.isArray(req.body.selectedSeats) && req.body.selectedSeats.length === 0) {
        errors.push('selectedSeats cannot be empty');
    }

    if (errors.length > 0) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(createErrorResponse(new AppError(errors, StatusCodes.BAD_REQUEST), 'Invalid seat booking request'));
    }
    next();
}

module.exports = {
    validateCreateBooking,
    validateMakePayment,
    validateSeatBooking,
};
