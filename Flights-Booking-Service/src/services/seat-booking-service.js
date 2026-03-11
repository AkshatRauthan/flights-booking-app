const axios = require("axios");
const db = require("../models");
const { StatusCodes } = require("http-status-codes");

const { ENUMS } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { SeatBookingRepository } = require("../repositories");
const { Logger } = require('../config');

const seatBookingRepository = new SeatBookingRepository();

async function createSeatBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const seatsData = data.selectedSeats.map(seatId => ({
            user_id: data.userId,
            seat_id: seatId,
            flight_id: data.flightId,
        }));
        const response = await seatBookingRepository.createSeatBooking(seatsData, transaction);
        await transaction.commit();
        return response;
    }
    catch(error) {
        await transaction.rollback();
        if (error instanceof AppError) throw error;
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new AppError("Some of the selected seats are already booked", StatusCodes.CONFLICT);
        }
        Logger.error("Inside Seat Booking Service - error occurred");
        Logger.error(error);
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createSeatBooking,
}