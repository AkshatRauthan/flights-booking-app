const { Booking } = require('../models');
const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const CrudRepository = require('./crud-repositories');
const AppError = require('../utils/errors/app-error');
const { BOOKED, CANCELLED } = require('../utils/common/enums').BOOKING_STATUS;

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    async createBooking(data, transaction){
        const response = await Booking.create(data, {transaction: transaction});
        return response;
    }

    async get(data, transaction){
        const response = await Booking.findByPk(data, {transaction: transaction});
        if (!response){
            throw new AppError("Requested booking concerning the payment is not found", StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data, transaction){
        const response = await Booking.update(data, {
            where: {
                id: id
            }
        }, {transaction: transaction});
        if (!response || response[0] == 0){
            throw new AppError('Unable to find the corresponding booking data', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async cancelOldBookings(timestamp){
        const response = await Booking.update({status: CANCELLED},{
            where : {
                [Op.and]: [
                    {
                        createdAt: {
                            [Op.lt]: timestamp
                        }
                    },
                    {
                        status: {
                            [Op.not]: BOOKED
                        }
                    },
                    {
                        status: {
                            [Op.not]: CANCELLED
                        }
                    }
                ]
            }
        });
        return response;
    }
}

module.exports = BookingRepository;