const express = require('express');
const router = express.Router();

const { SeatBookingController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { seatBookingSchema } = require('../../middlewares/validators');

router.post('/', validate(seatBookingSchema), SeatBookingController.createSeatBooking);

module.exports = router;