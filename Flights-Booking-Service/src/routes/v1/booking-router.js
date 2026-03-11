const express = require('express');
const router = express.Router();

const { BookingController } = require('../../controllers');
const { BookingMiddleware } = require('../../middlewares');

router.post('/', BookingMiddleware.validateCreateBooking, BookingController.createBooking);
router.post('/payments', BookingMiddleware.validateMakePayment, BookingController.makePayment);
router.post('/cancel', BookingController.cancelOldBookings);

module.exports = router;