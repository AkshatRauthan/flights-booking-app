const { AirportRepository } = require('../repositories');

const { StatusCodes } = require('http-status-codes');

const AppError = require('../utils/errors/app-error');

const airportRepository = new AirportRepository();

async function createAirport(data){
    try {
        const airport = await airportRepository.create(data);
        return airport;
    } catch (error) {
        if (['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(error.name)) {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Airport object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirports() {
    try {
        const airports = await airportRepository.getAll();
        return airports;
    } catch (error) {
        throw new AppError('Cannot fetch the data of all the airports', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirport(id){
    try {
        const airport = await airportRepository.get(id);
        return airport;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('Airport with the requested id do not exists', error.statusCode);
        }
        throw new AppError('Cannot fetch the data of requested airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirport(id, data) {
    try {
        const airport = await airportRepository.update(id, data);
        return airport;
    } catch (error) {
        if (['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(error.name) || error.statusCode == StatusCodes.NOT_FOUND) {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        else throw new AppError('Cannot update the data of requested airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirport(id){
    try {
        const airport = await airportRepository.destroy(id);
        return airport;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('Airport with the requested id do not exists', error.statusCode);
        } 
        throw new AppError('Cannot delete the data of requested airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createAirport,
    getAirports,
    getAirport,
    updateAirport,
    destroyAirport
};