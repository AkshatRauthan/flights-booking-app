const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const axios = require('axios');

const { FLIGHT_CREATION_SERVICE } = require("./../config/server-config");

const AppError = require('../utils/errors/app-error');
const { Logger } = require('../config');

async function getAllFlights(query) {
    try {
        Logger.info(`Flight search query: ${JSON.stringify(query)}`);
        const flights = await axios.get(`${FLIGHT_CREATION_SERVICE}/api/v1/flights`, {
            params: query
        });
        return flights.data.data;
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error(error);
        throw new AppError('Cannot fetch the data of requested flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlight(id){
    try {
        const flight = await axios.get(`${FLIGHT_CREATION_SERVICE}/api/v1/flights/${id}`,{
            id: id
        });
        return flight.data.data;
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error(error);
        throw new AppError('Cannot fetch the data of requested flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    getAllFlights,
    getFlight,
};  