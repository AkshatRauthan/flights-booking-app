const express = require('express');
const router = express.Router();

const { SeatBookingController } = require('../../controllers');

/**
 * @swagger
 * /api/v1/seat-bookings:
 *   post:
 *     summary: Create a seat booking
 *     tags: [Seat Bookings]
 *     responses:
 *       201:
 *         description: Seat booking created
 */
router.post(
    '/',
    SeatBookingController.createSeatBooking
)

module.exports = router;