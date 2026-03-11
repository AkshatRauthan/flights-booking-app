const { StatusCodes } = require('http-status-codes');

const { AirportServices } = require('../services');

const { createErrorResponse, createSuccessResponse } = require('../utils/common');

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
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully created an airport"));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * GET : /airport
 * req-body : {}
*/
async function getAirports(req, res) {
    try {
        const response = await AirportServices.getAirports();
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, "Successfully fetched all the airports"));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * POST : /airport/:id
 * req-body : {}
*/
async function getAirport(req, res) {
    try{
        const response = await AirportServices.getAirport(req.params.id);
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully fetched the airport data"));
    } catch(error){
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
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
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully updated the airport"));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * DELETE : /airport/:id
 * req-body : {}
*/
async function destroyAirport(req, res) {
    try{
        const response = await AirportServices.destroyAirport(req.params.id);
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully deleted the airport data"));
    } catch(error){
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

module.exports = {
    createAirport,
    getAirports,
    getAirport,
    updateAirport,
    destroyAirport
}