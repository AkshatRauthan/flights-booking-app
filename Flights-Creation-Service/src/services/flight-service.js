const { FlightRepository, Seat } = require('../repositories');

const { StatusCodes } = require('http-status-codes');

const { DateTimeHelpers, QueryParsers } = require('../utils/common');
const { parseFilterQuery, parseOrderQuery } = QueryParsers;

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

async function isValidFlight(id) {
    const response = await flightRepository.get(id, false);
    if (!response || response.length === 0) {
        return false;
    }
    return true;
}

async function areValidSeats(flightId, seats){
    // const response = await flightRepository.get(id, false);
    // console.log(response);
    return true;
    if (!response || response.length === 0) {
        return false;
    }
    return true;
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
        console.log(error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Cannot get the requested flight details', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllFlights(query) {
    let customFilter = parseFilterQuery(query);
    let sortFilter = parseOrderQuery(query);
    console.log(query);
    try {
        console.log("Custom Filter: ");
        console.log(customFilter);
        console.log("Sort Filter: ");
        console.log(sortFilter);
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (error) {
        console.log(error);
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