const { createErrorResponse } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const { USER_ROLES_ENUMS } = require('../utils/common/enums');
const { CUSTOMER, AIRLINE_ADMIN, SYSTEM_ADMIN } = USER_ROLES_ENUMS;

const { AirlineAdminServices } = require("../services");

async function isAccountOwner(req, res, next) {
    const userId = req.params.id;
    if (req.user.id != userId) {
        return res
                .status(StatusCodes.FORBIDDEN)
                .json(createErrorResponse(new AppError("You are not authorised to perform this action", StatusCodes.FORBIDDEN), 'You are not authorised to perform this action'));
    }
    next();
}

async function isAirlineAdmin(req, res, next){
    if (req.user.role !== AIRLINE_ADMIN) {
        return res
                .status(StatusCodes.FORBIDDEN)
                .json(createErrorResponse(new AppError("You are not authorised to perform this action", StatusCodes.FORBIDDEN), 'You are not authorised to perform this action'));
    }
    next();
}

async function validateAirlineAdmin(req, res, next){
    const airlineId = req.params.airlineId || req.params.id;
    const isValid = await AirlineAdminServices.validateAirlineAdmin(req.user.id, airlineId);
    if (isValid){
        return next();
    }
    return res
            .status(StatusCodes.FORBIDDEN)
            .json(createErrorResponse(new AppError("You are not authorised to perform this action", StatusCodes.FORBIDDEN), 'You are not authorised to perform this action'));
}


module.exports = {
    isAccountOwner,
    isAirlineAdmin,
    validateAirlineAdmin,
}