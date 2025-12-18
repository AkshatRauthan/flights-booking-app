const express = require('express');
const router = express.Router();

const { BookingController } = require('../../controllers');

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightId:
 *                 type: string
 *               userId:
 *                 type: string
 *               noOfSeats:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post(
    '/',
    BookingController.createBooking
)

/**
 * @swagger
 * /api/v1/bookings/payments:
 *   post:
 *     summary: Make a payment for a booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               totalCost:
 *                 type: integer
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment successful
 */
router.post(
    '/payments',
    BookingController.makePayment
)

/**
 * @swagger
 * /api/v1/bookings/cancel:
 *   post:
 *     summary: Cancel old bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Old bookings cancelled
 */
router.post(
    '/cancel',
    BookingController.cancelOldBookings
)

module.exports = router;