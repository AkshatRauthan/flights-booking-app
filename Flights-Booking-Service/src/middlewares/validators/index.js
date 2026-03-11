const { z } = require('zod');

const createBookingSchema = z.object({
    flightId: z.number({ coerce: true }).int().positive('flightId must be a positive integer'),
    userId: z.number({ coerce: true }).int().positive('userId must be a positive integer'),
    noOfSeats: z.number({ coerce: true }).int().min(1, 'noOfSeats must be at least 1'),
    selectedSeats: z.union([
        z.array(z.number({ coerce: true }).int().positive()).min(1, 'At least one seat must be selected'),
        z.string().transform((val) => JSON.parse(val)),
    ]),
});

const makePaymentSchema = z.object({
    bookingId: z.number({ coerce: true }).int().positive('bookingId is required'),
    userId: z.number({ coerce: true }).int().positive('userId is required'),
    totalCost: z.number({ coerce: true }).positive('totalCost must be positive'),
});

const seatBookingSchema = z.object({
    flightId: z.number({ coerce: true }).int().positive('flightId is required'),
    userId: z.number({ coerce: true }).int().positive('userId is required'),
    selectedSeats: z.array(z.number({ coerce: true }).int().positive()).min(1, 'selectedSeats must have at least one seat'),
});

const cancelBookingSchema = z.object({
    bookingId: z.number({ coerce: true }).int().positive('bookingId is required'),
});

module.exports = {
    createBookingSchema,
    makePaymentSchema,
    seatBookingSchema,
    cancelBookingSchema,
};
