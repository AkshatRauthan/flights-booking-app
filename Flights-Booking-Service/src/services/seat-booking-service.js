const axios = require("axios");
const db = require("../models");
const { StatusCodes } = require("http-status-codes");

const { ENUMS } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { SeatBookingRepository } = require("../repositories");

const seatBookingRepository = new SeatBookingRepository();

async function createSeatBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        // Create seatsData object
        const response = await seatBookingRepository.createSeatBooking(seatsData, transaction);
        await transaction.commit();
        return response;
    }
    catch(error) {
        await transaction.rollback();
        if (error instanceof AppError) throw error;
        console.log("\nInside Seat Booking Repo\n");
        console.log(error);
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createSeatBooking,
}