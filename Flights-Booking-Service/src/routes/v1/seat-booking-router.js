const express = require('express');
const router = express.Router();

const { SeatBookingController } = require('../../controllers');

router.post(
    '/',
    SeatBookingController.createSeatBooking
)

module.exports = router;