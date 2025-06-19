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
        throw new AppError(explanation.join(' .'), StatusCodes.BAD_REQUEST);
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
        throw new AppError("Something went wrong while validating the authentication token", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    validateAuthRequest,
    validateAuthToken,
};