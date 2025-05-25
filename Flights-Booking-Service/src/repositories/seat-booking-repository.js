const { Op } = require('sequelize');
const { sequelize } = require('../models');
const { Seat_Booking } = require('../models');
const { seatBookingQuery, seatUpdatingQuery, seatDeletingQuery } = require("./queries")
const { StatusCodes } = require('http-status-codes');
const CrudRepository = require('./crud-repositories');
const AppError = require('../utils/errors/app-error');

class SeatBookingRepository extends CrudRepository {
    constructor() {
        super(Seat_Booking);
    }

    async createSeatBooking(data, transaction) {
        const query = seatBookingQuery(data);
        const response = await sequelize.query(query, {
            type: sequelize.QueryTypes.INSERT,
            transaction: transaction
        });
        return response;
    }

    async updateSeatBookings(data, transaction){
        const query = seatUpdatingQuery(data);
        const response = await sequelize.query(query, {
            type: sequelize.QueryTypes.UPDATE,
            transaction: transaction
        });
        return response;
    }

    async deleteSeatBookings(data, transaction){
        const query = seatDeletingQuery(data);
        const response = await sequelize.query(query, {
            type: sequelize.QueryTypes.DELETE,
            // transaction: transaction
        });
        return response;
    }

    async get(data, transaction){
        const response = await Seat_Booking.findByPk(data, {transaction: transaction});
        if (!response){
            throw new AppError("Requested booking concerning the payment is not found", StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data, transaction){
        const response = await Seat_Booking.update(data, {
            where: {
                id: id
            }
        }, {
            transaction: transaction
        });
        if (!response || response[0] == 0){
            throw new AppError('Unable to find the corresponding booking data', StatusCodes.NOT_FOUND);
        }
        return response;
    }

}

module.exports = SeatBookingRepository;