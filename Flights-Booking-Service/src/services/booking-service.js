const axios = require("axios");
const db = require("../models");
const { ServerConfig } = require("../config");
const { BookingRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { ENUMS } = require("../utils/common");

const { BOOKING_STATUS } = ENUMS;

const bookingRepository = new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if (data.noOfSeats > flightData.totalSeats){
            throw new AppError("Required no of seats not available", StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfSeats * flightData.price;
        const bookingPayload = {...data, totalCost: totalBillingAmount};
        const booking = await bookingRepository.createBooking(bookingPayload, transaction);

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{ 
            seats: data.noOfSeats,
            dec: true
        });
        
        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        throw error;
    }
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    console.log(data);
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        const currentTime = new Date();
        const bookingTime = new Date(bookingDetails.createdAt);
        if (bookingDetails.status == BOOKING_STATUS.CANCELLED){
            throw new AppError("Booking is already cancelled", StatusCodes.BAD_REQUEST);
        }
        if (currentTime - bookingTime > 30000){
            console.log("Current Time: ", currentTime);
            console.log("Booking Time: ", bookingTime);
            console.log(currentTime - bookingTime);
            await bookingRepository.update(data.bookingId, {status: BOOKING_STATUS.CANCELLED }, transaction);
            throw new AppError("Your booking has expired", StatusCodes.REQUEST_TIMEOUT);
        }
        if (bookingDetails.totalCost != data.totalCost){
            throw new AppError("The amount of the payment doesn't match", StatusCodes.BAD_REQUEST);
        }
        if (bookingDetails.userId != data.userId){
            throw new AppError("The user corresponding to this booking doesn't match", StatusCodes.BAD_REQUEST);
        }
        // Assume that payment is successfull
        // So now Booking is completed so convert it into BOOKED.
        await bookingRepository.update(data.bookingId, {status: BOOKING_STATUS.BOOKED }, transaction);
        await transaction.commit();
        return await bookingRepository.get(data.bookingId);
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment,
}