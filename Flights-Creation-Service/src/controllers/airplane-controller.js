const { StatusCodes } = require('http-status-codes');

const { AirplaneServices } = require('../services');

const { createErrorResponse, createSuccessResponse } = require('../utils/common');

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
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully created an airplane"));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * GET : /airplanes
 * req-body : {}
*/
async function getAirplanes(req, res) {
    try {
        const response = await AirplaneServices.getAirplanes();
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, "Successfully fetched all the airplanes"));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * POST : /airplanes/:id
 * req-body : {}
*/
async function getAirplane(req, res) {
    try{
        const response = await AirplaneServices.getAirplane(req.params.id);
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully fetched the airplane data"));
    } catch(error){
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
 * DELETE : /airplanes/:id
 * req-body : {}
*/
async function destroyAirplane(req, res) {
    try{
        const response = await AirplaneServices.destroyAirplane(req.params.id);
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully deleted the airplane data"));
    } catch(error){
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
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
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully updated the airplane data"));
    } catch(error){
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
}