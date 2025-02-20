const axios = require("axios");
const db = require("../models");
const { ServerConfig } = require("../config");
const { BookingRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

async function createBooking(data) {
    return new Promise((resolve, reject) => {
        const result = db.sequelize.transaction(async function bookingImplementation(t) {
            const flight = await axios.get(ServerConfig.FLIGHT_SERVICE+`/api/v1/flights/${data.flightId}`);
            const flightData = flight.data;
            if (data.noOfSeats > flightData.data.totalSeats){
                reject(new AppError("Required no of seats not available", StatusCodes.BAD_REQUEST));
            }
            else resolve(true);
        })
    });
}

module.exports = {
    createBooking,
}