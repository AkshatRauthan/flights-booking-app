const axios = require("axios");
const db = require("../models");
const { StatusCodes } = require("http-status-codes");

const { ENUMS } = require("../utils/common");
const { ServerConfig, Queue } = require("../config");
const AppError = require("../utils/errors/app-error");
const { BookingRepository } = require("../repositories");
const { getEmailById } = require("../utils/common/helpers/fetch-email");

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
    // console.log(data);
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        const currentTime = new Date();
        const bookingTime = new Date(bookingDetails.createdAt);
        // console.log(bookingDetails);
        if (bookingDetails.status == BOOKING_STATUS.CANCELLED){
            throw new AppError("Booking is already cancelled", StatusCodes.BAD_REQUEST);
        }
        if (currentTime - bookingTime > 900000){ // 15 minute window in milliseconds => 900000ms
            console.log("\nCurrent Time: ", currentTime);
            console.log("Booking Time: ", bookingTime);
            console.log(currentTime - bookingTime);
            await cancelBooking({
                bookingId: data.bookingId, 
                flightId: bookingDetails.flightId
            });
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
        const response = (await getEmailById(data.userId)).data;
        console.log('\nresponse')
        console.log(response);
        Queue.sendData({
            recipientEmail: response.data.email,
            subject: "Flight booked",
            content: `Flight Booked For FlightID : ${bookingDetails.flightId} with BookingID : ${data.bookingId}`
        })
        await transaction.commit();
        return await bookingRepository.get(data.bookingId);
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        if (bookingDetails.status == BOOKING_STATUS.CANCELLED){
            await transaction.commit();
            console.log("Booking is already cancelled");
            return true;    
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{ 
            seats: bookingDetails.noOfSeats,
            dec: false
        });
        bookingDetails.status = BOOKING_STATUS.CANCELLED;
        await bookingDetails.save({ transaction });
        await transaction.commit();
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBookings() {
    try {
        const currTime = new Date( Date.now() -  5 * 60 * 1000);
        const response = await bookingRepository.cancelOldBookings(currTime);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings,
    cancelBooking
}