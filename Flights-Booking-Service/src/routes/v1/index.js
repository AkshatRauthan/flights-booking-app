const express = require("express");
const router = express.Router();

const BookingRoutes = require('./booking-router');

router.use('/bookings', BookingRoutes);

module.exports = router;