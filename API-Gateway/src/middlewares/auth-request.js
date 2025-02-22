const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

function validateAuthRequest(req, res, next) {
    if (!req.body.email || !req.body.password) {
        let explanation = [];
        if (!req.body.email) {
            explanation.push('Email is not present in the request body');
        }
        if (!req.body.password) {
            explanation.push('Password is not present in the request body');
        }
        ErrorResponse.message = 'Something went wrong while processing the request';
        ErrorResponse.error = new AppError(explanation, StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
};

module.exports = {
    validateAuthRequest,
};