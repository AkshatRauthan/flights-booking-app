const { validateCreateBooking, validateMakePayment, validateSeatBooking } = require('../../../src/middlewares/booking-middlewares');

describe('Booking Middlewares', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    describe('validateCreateBooking', () => {
        it('should call next with valid data', () => {
            req.body = { flightId: 1, userId: 1, noOfSeats: 2, selectedSeats: [1, 2] };
            validateCreateBooking(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 when flightId is missing', () => {
            req.body = { userId: 1, noOfSeats: 2, selectedSeats: [1, 2] };
            validateCreateBooking(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 400 when userId is missing', () => {
            req.body = { flightId: 1, noOfSeats: 2, selectedSeats: [1, 2] };
            validateCreateBooking(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when noOfSeats is not a positive integer', () => {
            req.body = { flightId: 1, userId: 1, noOfSeats: -1, selectedSeats: [1] };
            validateCreateBooking(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when all fields are missing', () => {
            validateCreateBooking(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('validateMakePayment', () => {
        it('should call next with valid payment data', () => {
            req.body = { bookingId: 1, userId: 1, totalCost: 5000 };
            req.headers['x-idempotency-key'] = 'unique-key-123';
            validateMakePayment(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 when idempotency key missing', () => {
            req.body = { bookingId: 1, userId: 1, totalCost: 5000 };
            validateMakePayment(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when bookingId is missing', () => {
            req.body = { userId: 1, totalCost: 5000 };
            req.headers['x-idempotency-key'] = 'key';
            validateMakePayment(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when totalCost is not a number', () => {
            req.body = { bookingId: 1, userId: 1, totalCost: 'abc' };
            req.headers['x-idempotency-key'] = 'key';
            validateMakePayment(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('validateSeatBooking', () => {
        it('should call next with valid seat booking data', () => {
            req.body = { flightId: 1, userId: 1, selectedSeats: [1, 2, 3] };
            validateSeatBooking(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 when selectedSeats is not an array', () => {
            req.body = { flightId: 1, userId: 1, selectedSeats: 'not-array' };
            validateSeatBooking(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when selectedSeats is empty', () => {
            req.body = { flightId: 1, userId: 1, selectedSeats: [] };
            validateSeatBooking(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
