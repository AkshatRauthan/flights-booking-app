const { StatusCodes } = require('http-status-codes');

const { FlightServices } = require('../services');

const { createErrorResponse, createSuccessResponse } = require('../utils/common');
const { Logger } = require('../config');

/*
GET : /flights
    req-query : {
        trips: MUM-DEL,
        price: 1000-5000,
        travellers: 2,
        tripDate: 2022-12-12,
        sort: price_desc
    }
*/
async function getAllFlights(req, res){
    try {
        const response = await FlightServices.getAllFlights(req.query);
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, "Successfully fetched all the flights"));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
POST : /flights/:id
    req-body : {
    }
*/
async function getFlight(req, res) {
    try{
        const response = await FlightServices.getFlight(req.params.id);
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, "Successfully fetched the flight data"));
    } catch(error){
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

module.exports = {
    getAllFlights,
    getFlight,
}