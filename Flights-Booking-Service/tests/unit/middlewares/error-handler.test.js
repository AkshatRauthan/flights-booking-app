jest.mock('../../../src/config', () => ({
    Logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

const { globalErrorHandler, notFoundHandler } = require('../../../src/middlewares/error-handler');

describe('Error Handler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { originalUrl: '/api/v1/bookings', method: 'POST', ip: '127.0.0.1' };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('should handle errors with custom status code', () => {
        const err = { statusCode: 409, message: 'Seat conflict' };
        globalErrorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
    });

    it('should return 404 for unmatched routes', () => {
        notFoundHandler(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
    });
});
