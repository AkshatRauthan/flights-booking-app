const { StatusCodes } = require('http-status-codes');

const { CityServices } = require('../services');

const { ErrorResponse, SuccessResponse } = require('../utils/common');

/*
 * POST : /city
 * req-body : {name}
*/
async function createCity(req, res){
    try {
        const response = await CityServices.createCity({
            name: req.body.name
        });
        SuccessResponse.message = "Successfully created an city";
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
 * GET : /city
 * req-body : {}
*/
async function getCities(req, res) {
    try {
        const response = await CityServices.getCities();
        SuccessResponse.message = "Successfully fetched all the cities";
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
 * POST : /city/:id
 * req-body : {}
*/
async function getCity(req, res) {
    try{
        const response = await CityServices.getCity(req.params.id);
        SuccessResponse.message = "Successfully fetched the city data";
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
 * DELETE : /city/:id
 * req-body : {}
*/
async function destroyCity(req, res) {
    try{
        const response = await CityServices.destroyCity(req.params.id);
        SuccessResponse.message = "Successfully deleted the city data";
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
 * PATCH : /city/:id
 * req-body : {name}
*/
async function updateCity(req, res){
    try{
        const response = await CityServices.updateCity(req.params.id, {
            name: req.body.name 
        });
        SuccessResponse.message = "Successfully updated the city data";
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
    createCity,
    getCities,
    getCity,
    destroyCity,
    updateCity
}