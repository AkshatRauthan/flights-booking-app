const express = require('express');
const router = express.Router();

const { BookingController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { createBookingSchema, makePaymentSchema } = require('../../middlewares/validators');

router.post('/', validate(createBookingSchema), BookingController.createBooking);
router.post('/payments', validate(makePaymentSchema), BookingController.makePayment);
router.post('/cancel', BookingController.cancelOldBookings);
router.get('/user/:userId', BookingController.getUserBookings);
router.post('/cancel-booking', BookingController.cancelBooking);

module.exports = router;