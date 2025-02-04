const { AirplaneRepository } = require('../repositories');

const { StatusCodes } = require('http-status-codes');

const AppError = require('../utils/errors/app-error');

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data){
    try {
        const airplane = await airplaneRepository.create(data);
        return airplane;
    } catch (error) {
        if (error.name == 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Airplane object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplanes() {
    try {
        const airplanes = await airplaneRepository.getAll();
        return airplanes;
    } catch (error) {
        throw new AppError('Cannot fetch the data of all the airplanes', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplane(id){
    try {
        const airplane = await airplaneRepository.get(id);
        return airplane;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('Airplane with the requested id do not exists', error.statusCode);
        } 
        throw new AppError('Cannot fetch the data of requested airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirplane(id){
    try {
        const airplane = await airplaneRepository.destroy(id);
        return airplane;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('Airplane with the requested id do not exists', error.statusCode);
        } 
        throw new AppError('Cannot delete the data of requested airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirplane(id, data){
    try {
        const airplane = await airplaneRepository.update(id, data);
        return airplane;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('Airplane with the requested id do not exists', error.statusCode);
        }
        throw new AppError('Cannot update the data of requested airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
};