jest.mock('../../../src/config', () => ({
    Logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

const { globalErrorHandler, notFoundHandler } = require('../../../src/middlewares/error-handler');

describe('Error Handler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { originalUrl: '/api/v1/flights', method: 'GET', ip: '127.0.0.1' };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('should handle errors with custom status code', () => {
        const err = { statusCode: 422, message: 'Validation error' };
        globalErrorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(422);
    });

    it('should default to 500 without statusCode', () => {
        globalErrorHandler({}, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return 404 for not found', () => {
        notFoundHandler(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            error: expect.objectContaining({
                explanation: 'Cannot GET /api/v1/flights',
            }),
        }));
    });
});
