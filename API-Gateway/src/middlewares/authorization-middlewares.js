const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

const { USER_ROLES_ENUMS } = require('../utils/common/enums')
const { CUSTOMER, AIRLINE_ADMIN, SYSTEM_ADMIN } = USER_ROLES_ENUMS;

async function isAdmin(req, res, next){
    if (req.user.role !== AIRLINE_ADMIN || req.user.role !== SYSTEM_ADMIN) {
        ErrorResponse.message = 'Something went wrong while processing the request';
        ErrorResponse.error = new AppError("You are not authorised to perform this action", StatusCodes.FORBIDDEN);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

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


module.exports = {
    isAdmin,
    isAccountOwner,
}