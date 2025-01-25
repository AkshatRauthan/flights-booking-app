const { StatusCodes } = require('http-status-codes');

const { AirportServices } = require('../services');

const { ErrorResponse, SuccessResponse } = require('../utils/common');

/*
 * POST : /airport
 * req-body : {name, code, address, cityId}
*/
async function createAirport(req, res){
    try {
        const response = await AirportServices.createAirport({
            name: req.body.name,
            code: req.body.code,
            address: req.body.address,
            cityId: req.body.cityId
        });
        SuccessResponse.message = "Successfully created an airport";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

/*
 * GET : /airport
 * req-body : {}
*/
async function getAirports(req, res) {
    try {
        const response = await AirportServices.getAirports();
        SuccessResponse.message = "Successfully fetched all the airports";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

/*
 * POST : /airport/:id
 * req-body : {}
*/
async function getAirport(req, res) {
    try{
        const response = await AirportServices.getAirport(req.params.id);
        SuccessResponse.message = "Successfully fetched the airport data";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error){
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

/*
 * PATCH : /airport/:id
 * req-body : {name, code, address, cityId}
*/
async function updateAirport(req, res){
    try {
        const response = await AirportServices.updateAirport(req.params.id, {
            name: req.body.name,
            code: req.body.code,
            address: req.body.address,
            cityId: req.body.cityId
        });
        SuccessResponse.message = "Successfully updated the airport";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

/*
 * DELETE : /airport/:id
 * req-body : {}
*/
async function destroyAirport(req, res) {
    try{
        const response = await AirportServices.destroyAirport(req.params.id);
        SuccessResponse.message = "Successfully deleted the airport data";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error){
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    createAirport,
    getAirports,
    getAirport,
    updateAirport,
    destroyAirport
}