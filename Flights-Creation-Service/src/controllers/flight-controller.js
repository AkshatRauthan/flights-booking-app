const { StatusCodes } = require('http-status-codes');

const { FlightServices } = require('../services');

const { createErrorResponse, createSuccessResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { Logger } = require('../config');

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
            departureAirportId: req.body.departureAirportId,
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
PATCH : /flights/seats/:flightid
    req-body : {
        seats : 10, [number of seats to add or remove]
        dec : true / false, [weather to decrease seats or increase by above count]
    }
*/
async function updateSeats(req, res) {
    let dec = req.body.dec;
    try {
        const response = await FlightServices.updateSeats({
            flightId: req.params.id,
            seats: req.body.seats,
            dec: (dec === 'false' || dec === false) ? false : true,
        })
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, "Successfully updates the seats data"));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}


async function isValidFlight(req, res) {
    try {
        const id = req.body.id;
        const isValid = await FlightServices.isValidFlight(id);
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(
                    { isValid: isValid },
                    isValid ? "Requested Flight is valid" : "Requested Flight is not valid"
                ));
    } catch (error){
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

async function areValidSeats(req, res) {
    try {
        const flightId = req.body.flightId;
        const seats = req.body.seats;
        const isValid = await FlightServices.areValidSeats(flightId, seats);

        // Think how we are going to implement it........................

        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(
                    { isValid: isValid },
                    isValid ? "Requested Seats are valid" : "Requested Seats are not valid"
                ));
    } catch (error){
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

async function getFlight(req, res){
    try {
        const id = req.params.id;
        const flight = await FlightServices.getFlight(id);
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(flight, "Successfully fetched the flight details"));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

async function getAllFlights(req, res){
    try {
        Logger.info(`Get all flights query: ${JSON.stringify(req.query)}`);
        let response = await FlightServices.getAllFlights(req.query);
        let data = [];
        response.forEach(obj => {
            data.push(obj.dataValues);
        });
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(data, "Successfully fetched all flights"));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

module.exports = {
    createFlight,
    updateSeats,
    isValidFlight,
    areValidSeats,
    getFlight,
    getAllFlights,
}