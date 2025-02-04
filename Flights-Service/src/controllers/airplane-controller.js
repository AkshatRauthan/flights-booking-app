const { StatusCodes } = require('http-status-codes');

const { AirplaneServices } = require('../services');

const { ErrorResponse, SuccessResponse } = require('../utils/common');

/*
 * POST : /airplanes
 * req-body : {modelName, capacity}
*/
async function createAirplane(req, res){
    try {
        const response = await AirplaneServices.createAirplane({
            modelNumber: req.body.modelNumber,
            capacity: req.body.capacity
        });
        SuccessResponse.message = "Successfully created an airplane";
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
 * GET : /airplanes
 * req-body : {}
*/
async function getAirplanes(req, res) {
    try {
        const response = await AirplaneServices.getAirplanes();
        SuccessResponse.message = "Successfully fetched all the airplanes";
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
 * POST : /airplanes/:id
 * req-body : {}
*/
async function getAirplane(req, res) {
    try{
        const response = await AirplaneServices.getAirplane(req.params.id);
        SuccessResponse.message = "Successfully fetched the airplane data";
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
 * DELETE : /airplanes/:id
 * req-body : {}
*/
async function destroyAirplane(req, res) {
    try{
        const response = await AirplaneServices.destroyAirplane(req.params.id);
        SuccessResponse.message = "Successfully deleted the airplane data";
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
 * DELETE : /airplanes/:id
 * req-body : {modelNumber, capacity}
*/
async function updateAirplane(req, res){
    try{
        let data = {};
        if (req.body.modelNumber) Object.assign(data, { modelNumber: req.body.modelNumber });
        if (req.body.capacity) Object.assign(data, { capacity: req.body.capacity });
        const response = await AirplaneServices.updateAirplane(req.params.id, data);
        SuccessResponse.message = "Successfully updated the airplane data";
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
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
}