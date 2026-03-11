const { FlightRepository, Seat } = require('../repositories');

const { StatusCodes } = require('http-status-codes');

const { DateTimeHelpers, QueryParsers } = require('../utils/common');
const { parseFilterQuery, parseOrderQuery } = QueryParsers;

const AppError = require('../utils/errors/app-error');
const { Logger } = require('../config');

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

async function isValidFlight(id) {
    const response = await flightRepository.get(id, false);
    if (!response || response.length === 0) {
        return false;
    }
    return true;
}

async function areValidSeats(flightId, seats) {
    try {
        const flight = await flightRepository.get(flightId);
        if (!flight) {
            return false;
        }
        if (seats.length > flight.totalSeats) {
            return false;
        }
        return true;
    } catch (error) {
        Logger.error(`Error validating seats: ${error.message}`);
        return false;
    }
}

async function getFlight(id){
    try {
        let flight = await flightRepository.getFlight(id);
        if (!flight || flight.length === 0) {
            throw new AppError('Requested flight not found', StatusCodes.NOT_FOUND);
        }
        flight = flight.dataValues;
        flight.Airplane = flight.Airplane.dataValues;
        flight.arrivalAirport = flight.arrivalAirport.dataValues;
        flight.departureAirport = flight.departureAirport.dataValues;
        flight.arrivalAirport.City = flight.arrivalAirport.City.dataValues;
        flight.departureAirport.City = flight.departureAirport.City.dataValues;
        return flight;
    } catch (error) {
        Logger.error(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Cannot get the requested flight details', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllFlights(query) {
    let customFilter = parseFilterQuery(query);
    let sortFilter = parseOrderQuery(query);
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    Logger.info(`Flight query: ${JSON.stringify(query)}`);
    try {
        Logger.info(`Custom Filter: ${JSON.stringify(customFilter)}`);
        Logger.info(`Sort Filter: ${JSON.stringify(sortFilter)}`);
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter, { page, limit });
        return flights;
    } catch (error) {
        Logger.error(error);
        throw new AppError('Cannot fetch the flights data regarding the search query', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createFlight,
    updateSeats,
    isValidFlight,
    getFlight,
    areValidSeats,
    getAllFlights,
};