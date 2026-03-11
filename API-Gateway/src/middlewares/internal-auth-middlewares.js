const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { createErrorResponse } = require('../utils/common');
const { SERVICE_TOKEN_EXPIRY_IN_SECONDS } = require("../config/server-config");
const { Logger } = require('../config');

const { ServiceAuthFunctions } = require('../utils/common');
const { decryptServiceToken } = ServiceAuthFunctions;

async function validateInternalAuthRequest(req, res, next) {
    const serviceToken = req.headers["x-service-token"];
    if (!serviceToken || serviceToken.trim() === "") {
        Logger.error("Service token is missing in the request headers");
        return res.status(StatusCodes.UNAUTHORIZED).json(createErrorResponse(new AppError("Service token is required", StatusCodes.UNAUTHORIZED)));
    }
    next();
}

async function verifyInternalAuthToken(req, res, next){
    try {
        const serviceToken = req.headers["x-service-token"];
        const decryptedToken = decryptServiceToken(serviceToken);
        if (!decryptedToken || !decryptedToken.sub) {
            Logger.error("Decrypted token is invalid or missing 'sub' field");
            return res.status(StatusCodes.UNAUTHORIZED).json(createErrorResponse(new AppError("Invalid service token", StatusCodes.UNAUTHORIZED)));
        }
        if (!decryptedToken.permission || !Array.isArray(decryptedToken.permission) || decryptedToken.permission.length === 0) {
            Logger.error("Decrypted token is missing permissions object");
            return res.status(StatusCodes.UNAUTHORIZED).json(createErrorResponse(new AppError("Service token does not have required permissions", StatusCodes.UNAUTHORIZED)));
        }

        if (!decryptedToken.exp || Date.now() - decryptedToken.iat > Number(SERVICE_TOKEN_EXPIRY_IN_SECONDS) * 1000) {
            Logger.error("Service token has expired");
            return res.status(StatusCodes.UNAUTHORIZED).json(createErrorResponse(new AppError("Service token has expired", StatusCodes.UNAUTHORIZED)));
        }
        req.service = decryptedToken;
        next();
    } catch (error) {
        Logger.error(`Error verifying service token: ${error.message}`);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json(createErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorResponse(new AppError("An unexpected error occurred while verifying service token", StatusCodes.INTERNAL_SERVER_ERROR)));
    }
}

async function canRegisterUser(req, res, next){
    try {
        if (req.service.permission.includes('register-airline-admin') && req.service.sub === "flight-creation-service") {
            return next();
        }
        return res.status(StatusCodes.FORBIDDEN).json(createErrorResponse(new AppError("Service does not have permission to register users", StatusCodes.FORBIDDEN)));
    } catch (error) {
        Logger.error(`Error checking permissions: ${error.message}`);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json(createErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorResponse(new AppError("An unexpected error occurred while checking permissions", StatusCodes.INTERNAL_SERVER_ERROR)));
    }
}

module.exports = {
    validateInternalAuthRequest,
    verifyInternalAuthToken,
    canRegisterUser,
};