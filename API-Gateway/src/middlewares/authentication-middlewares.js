const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');

async function validateAuthRequest(req, res, next) {
    console.log("Hello1");
    console.log(req.body);
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
    console.log("Hello");
    next();
};

async function validateAuthToken(req, res, next) {
    try {
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        if (response) {
            req.user = response.user; // Setting the User ID in the req object
            // { user: { id: 6, email: 'akshatrauthan1234@gmail.com', role: 'customer' } }
            next();
        }
    } catch (error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}



module.exports = {
    validateAuthRequest,
    validateAuthToken,
};