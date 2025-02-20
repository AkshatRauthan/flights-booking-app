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

async function getAllFlights(query) {
    let customFilter = {};
    let sortFilter = {};
    const dayLastMinute = " 23:59:59";
    // trips=MUM-DEL
    if (query.trips){
        [departureAirportId, arrivalAirportId] = query.trips.split("-");
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
    }
    if (query.price){
        [minPrice, maxPrice] = query.price.split("-");
        customFilter.price = {
            [Op.between]: [minPrice, maxPrice]
        }
    }
    if (query.travellers){
        customFilter.totalSeats = {
            [Op.gte]: query.travellers
        }
    }
    if (query.tripDate){
        customFilter.departureTime = {
            [Op.between]: [query.tripDate, query.tripDate + dayLastMinute]
        }
    }
    if (query.sort){
        sortFilter = query.sort.split(",").map((field) => {
            return field.split("_");
        });
    }
    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (error) {
        throw new AppError('Cannot fetch the flights data regarding the search query', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlight(id){
    try {
        const flight = await flightRepository.get(id);
        return flight;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('Flight with the requested id do not exists', error.statusCode);
        } 
        throw new AppError('Cannot fetch the data of requested flight', StatusCodes.INTERNAL_SERVER_ERROR);
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
    getAllFlights,
    getFlight,
    updateSeats,
};  