const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');

const AppError = require('../utils/errors/app-error');

function validateCreateObject(req, res, next){
    const { flightNumber, airplaneId, departureAirportId, arrivalAirportId, 
            arrivalTime, departureTime, price, boardingGate } = req.body;

    if (!(flightNumber && airplaneId && departureAirportId && arrivalAirportId && arrivalTime && departureTime && price)){
        let explanation = [];
        if (!flightNumber) explanation.push('Flight number not present in the incoming request in the correct format');
        if (!airplaneId) explanation.push('Airplane id not present in the incoming request in the correct format');
        if (!departureAirportId) explanation.push('Departure airport id not present in the incoming request in the correct format');
        if (!arrivalAirportId) explanation.push('Arrival airport id not present in the incoming request in the correct format');
        if (!arrivalTime) explanation.push('Arrival time not present in the incoming request in the correct format');
        if (!departureTime) explanation.push('Departure time not present in the incoming request in the correct format');
        if (!price) explanation.push('Price not present in the incoming request in the correct format');
        
        ErrorResponse.message = 'Something went wrong while creating the flight';
        ErrorResponse.error = new AppError(explanation, StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    else next();
}

function validateUpdateSeatsRequest(req, res, next) {
    if (!req.body.seats || req.body.seats < 0 || (req.body.dec && !([true, false, 'true', 'false'].includes(req.body.dec)))){
        let explanation = [];
        if (!req.body.seats) explanation.push("Seats count not found in the incomong request body");
        if (req.body.seats < 0) explanation.push("Seats count cannot be negative");
        if (!([true, false, "true", "false"].includes(req.body.dec))) explanation.push("Unexpected value for dec in the incoming request body");
        ErrorResponse.message = 'Something went wrong while updating the flight';
        ErrorResponse.error = new AppError(explanation, StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    else next();
}

module.exports = {
    validateCreateObject,
    validateUpdateSeatsRequest,
}