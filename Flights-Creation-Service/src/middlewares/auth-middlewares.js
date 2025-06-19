const { ErrorResponse } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');

const { USER_ROLES_ENUMS } = require('../utils/common/enums');
const { CUSTOMER, AIRLINE_ADMIN, SYSTEM_ADMIN } = USER_ROLES_ENUMS;

const { AirlineAdminServices } = require("../services");

async function isAccountOwner(req, res, next) {
    const userId = req.params.id;
    if (req.user.id != userId) {
        ErrorResponse.message = 'Something went wrong while processing the request';
        ErrorResponse.error = new AppError("You are not authorised to perform this action", StatusCodes.FORBIDDEN);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

async function isAirlineAdmin(req, res, next){
    if (req.user.role !== AIRLINE_ADMIN) {
        ErrorResponse.message = 'Something went wrong while processing the request';
        ErrorResponse.error = new AppError("You are not authorised to perform this action", StatusCodes.FORBIDDEN);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

async function validateAirlineAdmin(req, res, next){
    const airlineId = req.params.airlineId || req.params.id;
    const isValid = await AirlineAdminServices.validateAirlineAdmin(req.user.id, airlineId);
    if (isValid){
        next();
    }
    ErrorResponse.message = 'Something went wrong while processing the request';
    ErrorResponse.error = new AppError("You are not authorised to perform this action", StatusCodes.FORBIDDEN);
    return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
}


module.exports = {
    isAccountOwner,
    isAirlineAdmin,
    validateAirlineAdmin,
}