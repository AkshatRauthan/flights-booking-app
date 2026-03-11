jest.mock('../../../src/config', () => ({
    Logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    },
}));

const { globalErrorHandler, notFoundHandler } = require('../../../src/middlewares/error-handler');

describe('Error Handler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { originalUrl: '/test', method: 'GET', ip: '127.0.0.1' };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    describe('globalErrorHandler', () => {
        it('should handle error with statusCode', () => {
            const err = { statusCode: 400, message: 'Bad Request', explanation: 'Missing field' };
            globalErrorHandler(err, req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Bad Request',
            }));
        });

        it('should default to 500 when no statusCode', () => {
            const err = { message: 'Something broke' };
            globalErrorHandler(err, req, res, next);
            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('should default message to Internal Server Error', () => {
            const err = {};
            globalErrorHandler(err, req, res, next);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Internal Server Error',
            }));
        });
    });

    describe('notFoundHandler', () => {
        it('should return 404 with correct method and URL', () => {
            req.method = 'POST';
            req.originalUrl = '/api/v1/nonexistent';
            notFoundHandler(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Resource not found',
            }));
        });
    });
});
