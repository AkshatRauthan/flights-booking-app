const express = require('express');
const router = express.Router();

const { SeatBookingController } = require('../../controllers');
const { BookingMiddleware } = require('../../middlewares');

router.post('/', BookingMiddleware.validateSeatBooking, SeatBookingController.createSeatBooking);

module.exports = router;