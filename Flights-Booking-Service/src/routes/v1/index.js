const express = require("express");
const router = express.Router();

const BookingRoutes = require('./booking-router');
const SeatBookingRoutes = require('./seat-booking-router');

router.use('/bookings', BookingRoutes);
router.use('/seats/bookings', SeatBookingRoutes);

module.exports = router;s