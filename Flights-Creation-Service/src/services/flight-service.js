const { FlightRepository } = require('../repositories');

const { StatusCodes } = require('http-status-codes');

const { DateTimeHelpers } = require('../utils/common');

const AppError = require('../utils/errors/app-error');

const { Op } = require('sequelize');

const flightRepository = new FlightRepository();

async function createFlight(data){
    try {
        if (DateTimeHelpers.compareTime(data.departureTime, data.arrivalTime)){
            throw new AppError(`Flight arrival time cannot be ahead of flight's departure time`, StatusCodes.BAD_REQUEST);
        }
        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {
        if (['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(error.name)) {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Flight object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateSeats(data){
    try {
        const response = await flightRepository.updateRemainingSeat(data.flightId, data.seats, data.dec);
        return response;
    } catch (error) {
        throw new AppError("Cannot update data of the flight", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,
    updateSeats,
};