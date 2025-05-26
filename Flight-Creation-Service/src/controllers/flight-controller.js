const { StatusCodes } = require('http-status-codes');

const { FlightServices } = require('../services');

const { ErrorResponse, SuccessResponse } = require('../utils/common');

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
        SuccessResponse.message = "Successfully updates the seats data";
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

module.exports = {
    createFlight,
    updateSeats,
}