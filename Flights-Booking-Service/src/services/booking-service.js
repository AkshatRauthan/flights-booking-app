const axios = require("axios");
const db = require("../models");
const { StatusCodes } = require("http-status-codes");

const { ENUMS } = require("../utils/common");
const { ServerConfig, Queue } = require("../config");
const AppError = require("../utils/errors/app-error");
const { BookingRepository, SeatBookingRepository } = require("../repositories");
const { getEmailById } = require("../utils/common/helpers/fetch-email");

const { BOOKING_STATUS } = ENUMS;

const bookingRepository = new BookingRepository();
const seatBookingRepository = new SeatBookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {

        let isValidFlight = await axios.post(`${ServerConfig.FLIGHT_CREATION_SERVICE}/api/v1/flights/validate`, {
            id: data.flightId,
        });
        if (!isValidFlight.data.data.isValid) {
            throw new AppError("The requested flight do not exists.", StatusCodes.NOT_FOUND);
        }

        let isValidUser = await axios.post(`${ServerConfig.API_GATEWAY}/api/v1/user/validate`, {
            id: data.userId,
        });
        if (!isValidUser.data.data.isValid) {
            throw new AppError("Invalid user.", StatusCodes.NOT_FOUND);
        }

        // API call for validationg seats

        const flight = await axios.get(`${ServerConfig.FLIGHT_SEARCHING_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;

        let seatsData = [];

        data.selectedSeats.forEach((seat) => {
            seatsData.push({
                user_id: data.userId,
                seat_id: seat,
                flight_id: data.flightId,
            });
        });
        const seatBooking = await seatBookingRepository.createSeatBooking(seatsData, transaction);

        const totalBillingAmount = data.noOfSeats * flightData.price;
        const bookingPayload = {...data, totalCost: totalBillingAmount};
        const booking = await bookingRepository.createBooking(bookingPayload, transaction);

        let updateSeats = {
            id: seatBooking[0],
            booking_id: booking.dataValues.id,
            user_id: booking.dataValues.userId,
            flight_id: booking.dataValues.flightId,
        }
        await seatBookingRepository.updateSeatBookings(updateSeats, transaction);
        
        await transaction.commit();

        // Doing it outside. Find a way to improve it.
        await axios.patch(`${ServerConfig.FLIGHT_CREATION_SERVICE}/api/v1/flights/${data.flightId}/seats`,{ 
            seats: data.noOfSeats,
            dec: true
        });
        return booking;
    } catch (error) {
        await transaction.rollback();
        if (error instanceof AppError)
            throw error;
        if (error.name == "SequelizeUniqueConstraintError" && error.errors[0].path == "unique_seat_flight")
            throw new AppError("Some of the selected seats are already booked", StatusCodes.CONFLICT);
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {

        let isValid = await isValidBooking(data.bookingId);
        if (!isValid) throw new AppError("Invalid booking ID", StatusCodes.NOT_FOUND);

        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        const currentTime = new Date();
        const bookingTime = new Date(bookingDetails.createdAt);
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
        await axios.patch(`${ServerConfig.FLIGHT_CREATION_SERVICE}/api/v1/flights/${data.flightId}/seats`,{ 
            seats: bookingDetails.noOfSeats,
            dec: false
        });
        bookingDetails.status = BOOKING_STATUS.CANCELLED;
        await bookingDetails.save({ transaction });
        await transaction.commit();
    } catch (error) {
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

async function isValidBooking(id) {
    const response = await bookingRepository.get(id, false);
    console.log(response);
    if (!response || response.length === 0) {
        return false;
    }
    return true;
}

module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings,
    cancelBooking,
    isValidBooking
}