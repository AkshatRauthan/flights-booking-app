const { StatusCodes } = require('http-status-codes');

const { CityServices } = require('../services');

const { createErrorResponse, createSuccessResponse } = require('../utils/common');

/*
 * POST : /city
 * req-body : {name}
*/
async function createCity(req, res){
    try {
        const response = await CityServices.createCity({
            name: req.body.name
        });
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully created an city"));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * GET : /city
 * req-body : {}
*/
async function getCities(req, res) {
    try {
        const response = await CityServices.getCities();
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, "Successfully fetched all the cities"));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * POST : /city/:id
 * req-body : {}
*/
async function getCity(req, res) {
    try{
        const response = await CityServices.getCity(req.params.id);
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully fetched the city data"));
    } catch(error){
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * DELETE : /city/:id
 * req-body : {}
*/
async function destroyCity(req, res) {
    try{
        const response = await CityServices.destroyCity(req.params.id);
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully deleted the city data"));
    } catch(error){
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * PATCH : /city/:id
 * req-body : {name}
*/
async function updateCity(req, res){
    try{
        const response = await CityServices.updateCity(req.params.id, {
            name: req.body.name 
        });
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully updated the city data"));
    } catch(error){
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

module.exports = {
    createCity,
    getCities,
    getCity,
    destroyCity,
    updateCity
}