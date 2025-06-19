const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { SERVICE_TOKEN_EXPIRY_IN_SECONDS } = require("../config/server-config");

const { ServiceAuthFunctions } = require('../utils/common');
const { decryptServiceToken } = ServiceAuthFunctions;

async function validateInternalAuthRequest(req, res, next) {
    const serviceToken = req.headers["x-service-token"];
    if (!serviceToken || serviceToken.trim() === "") {
        console.error("Service token is missing in the request headers");
        throw new AppError("Service token is required", StatusCodes.UNAUTHORIZED);
    }
    next();
}

async function verifyInternalAuthToken(req, res, next){
    try {
        const serviceToken = req.headers["x-service-token"];
        const decryptedToken = decryptServiceToken(serviceToken);
        console.log(decryptedToken);
        if (!decryptedToken || !decryptedToken.sub) {
            console.error("Decrypted token is invalid or missing 'sub' field");
            throw new AppError("Invalid service token", StatusCodes.UNAUTHORIZED);
        }
        if (!decryptedToken.permission || !Array.isArray(decryptedToken.permission) || decryptedToken.permission.length === 0) {
            console.error("Decrypted token is missing permissions object");
            throw new AppError("Service token does not have required permissions", StatusCodes.UNAUTHORIZED);
        }

        if (!decryptedToken.exp || Date.now() - decryptedToken.iat > Number(SERVICE_TOKEN_EXPIRY_IN_SECONDS) * 1000) {
            console.error("Service token has expired");
            throw new AppError("Service token has expired", StatusCodes.UNAUTHORIZED);
        }
        req.service = decryptedToken;
        next();
    } catch (error) {
        if (error instanceof AppError) return error;
        console.log(error);
        return new AppError("An unexpected error occurred while verifying service token", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function canRegisterUser(req, res, next){
    console.log("Req ser:\n",req.service);
    try {
        if (req.service.permission.includes('register-airline-admin') && req.service.sub === "flight-creation-service") {
            next();
        }
        throw new AppError("Service does not have permission to register users", StatusCodes.FORBIDDEN);
    } catch (error) {
        if (error instanceof AppError) return error;
        console.log(error);
        return new AppError("An unexpected error occurred while checking permissions", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    validateInternalAuthRequest,
    verifyInternalAuthToken,
    canRegisterUser,
};