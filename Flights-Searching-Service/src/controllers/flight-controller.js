const { StatusCodes } = require('http-status-codes');

const { FlightServices } = require('../services');

const { ErrorResponse, SuccessResponse } = require('../utils/common');

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
        SuccessResponse.message = "Successfully fetched all flights";
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
POST : /flights/:id
    req-body : {
    }
*/
async function getFlight(req, res) {
    try{
        const response = await FlightServices.getFlight(req.params.id);
        SuccessResponse.message = "Successfully fetched the flight data";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch(error){
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    getAllFlights,
    getFlight,
}