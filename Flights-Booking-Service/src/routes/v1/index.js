const express = require("express");
const router = express.Router();

const BookingRoutes = require('./booking-router');
const SeatBookingRoutes = require('./seat-booking-router');
const swaggerSpec = require("../../config/swagger-config");

router.use('/bookings', BookingRoutes);
router.use('/seats/bookings', SeatBookingRoutes);
router.get('/api-docs/json', (req, res) => {
    res.json(swaggerSpec);
});


module.exports = router;