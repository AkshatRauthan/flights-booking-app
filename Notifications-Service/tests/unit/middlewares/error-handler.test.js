jest.mock('../../../src/config', () => ({
    Logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

const { globalErrorHandler, notFoundHandler } = require('../../../src/middlewares/error-handler');

describe('Error Handler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { originalUrl: '/api/v1/tickets', method: 'POST', ip: '127.0.0.1' };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
        next = jest.fn();
    });

    it('should handle errors correctly', () => {
        globalErrorHandler({ statusCode: 503, message: 'Service unavailable' }, req, res, next);
        expect(res.status).toHaveBeenCalledWith(503);
    });

    it('should return 404 for unknown routes', () => {
        notFoundHandler(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
    });
});
