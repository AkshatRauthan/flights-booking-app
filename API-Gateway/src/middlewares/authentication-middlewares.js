const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');
const { Logger } = require('../config');

async function validateAuthRequest(req, res, next) {
    Logger.info("validateAuthRequest called");
    Logger.info(`Request body: ${JSON.stringify(req.body)}`);
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
    Logger.info("Auth request validated successfully");
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
        Logger.error(error);
        throw new AppError("Something went wrong while validating the authentication token", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    validateAuthRequest,
    validateAuthToken,
};