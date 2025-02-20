const { Booking } = require('../models');
const { StatusCodes } = require('http-status-codes');
const CrudRepository = require('./crud-repositories');

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }
}

module.exports = BookingRepository;