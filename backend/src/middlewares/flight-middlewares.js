const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');

const AppError = require('../utils/errors/app-error');

function validateCreateObject(req, res, next){
    const { flightNumber, airplaneId, departureAirportId, arrivalAirportId, 
            arrivalTime, departureTime, price, boardingGate, totalSeats } = req.body;

    if (!(flightNumber && airplaneId && departureAirportId && arrivalAirportId && arrivalTime && departureTime && price && totalSeats)){
        let explanation = [];
        if (!flightNumber) explanation.push('Flight number not present in the incoming request in the correct format');
        if (!airplaneId) explanation.push('Airplane id not present in the incoming request in the correct format');
        if (!departureAirportId) explanation.push('Departure airport id not present in the incoming request in the correct format');
        if (!arrivalAirportId) explanation.push('Arrival airport id not present in the incoming request in the correct format');
        if (!arrivalTime) explanation.push('Arrival time not present in the incoming request in the correct format');
        if (!departureTime) explanation.push('Departure time not present in the incoming request in the correct format');
        if (!price) explanation.push('Price not present in the incoming request in the correct format');
        if (!totalSeats) explanation.push('Total seat number not present in the incoming request in the correct format');
        ErrorResponse.message = 'Something went wrong while creating the city';
        ErrorResponse.error = new AppError(explanation, StatusCodes.BAD_GATEWAY);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    else next();
}

module.exports = {
    validateCreateObject,
}