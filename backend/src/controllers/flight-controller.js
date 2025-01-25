const { StatusCodes } = require('http-status-codes');

const { FlightServices } = require('../services');

const { ErrorResponse, SuccessResponse } = require('../utils/common');

/*
 * POST : /flights
 * req-body : {name}
*/
async function createFlight(req, res){
    try {
        const { flightNumber, airplaneId, departureAirportId, arrivalAirportId, 
                arrivalTime, departureTime, price, boardingGate, totalSeats } = req.body;
        const response = await FlightServices.createFlight({
            price: price,
            airplaneId: airplaneId,
            totalSeats: totalSeats,
            arrivalTime: arrivalTime,
            boardingGate: boardingGate,
            flightNumber: flightNumber,
            departureTime: departureTime,
            arrivalAirportId: arrivalAirportId,
            arrivalAirportId: arrivalAirportId,
            departureAirportId: departureAirportId,
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

module.exports = {
    createFlight,
}