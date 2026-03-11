const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');

function globalErrorHandler(err, req, res, next) {
    Logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';
    
    return res.status(statusCode).json({
        success: false,
        message: message,
        data: {},
        error: {
            explanation: err.explanation || message,
            statusCode: statusCode
        }
    });
}

function notFoundHandler(req, res, next) {
    return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Resource not found',
        data: {},
        error: {
            explanation: `Cannot ${req.method} ${req.originalUrl}`,
            statusCode: StatusCodes.NOT_FOUND
        }
    });
}

module.exports = {
    globalErrorHandler,
    notFoundHandler,
};
