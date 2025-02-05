const { Booking } = require('../models');
const { StatusCodes } = require('http-status-codes');

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }
}

module.exports = BookingRepository;