const { StatusCodes } = require('http-status-codes');

const { FlightServices } = require('../services');

const { ErrorResponse, SuccessResponse } = require('../utils/common');
const { AirplaneController } = require('.');

/*
POST : /flights
    req-body : {
        price: 2750,
        totalSeats: 120,
        airplaneId: 11,
        boardingGate: '12A',
        flightNumber: 'UK 808',
        departureTime: '9:10:00'
        arrivalTime: '11:10:00'
        arrivalAirportId: DEL,
        departureAirportId: MUM,
    }
*/
async function createFlight(req, res){
    try {
        const response = await FlightServices.createFlight({
            price: req.body.price,
            airplaneId: req.body.airplaneId,
            totalSeats: req.body.totalSeats,
            arrivalTime: req.body.arrivalTime,
            boardingGate: req.body.boardingGate,
            flightNumber: req.body.flightNumber,
            departureTime: req.body.departureTime,
            arrivalAirportId: req.body.arrivalAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            departureAirportId: req.body.departureAirportId,
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
 * POST : /flights/:id
 * req-body : {}
*/
async function getFlight(req, res) {
    try{
        const response = await FlightServices.getFlight(req.params.id);
        SuccessResponse.message = "Successfully fetched the flight data";
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
    createFlight,
    getAllFlights,
    getFlight,
}