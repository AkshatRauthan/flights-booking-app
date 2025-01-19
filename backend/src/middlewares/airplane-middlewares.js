const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');

const AppError = require('../utils/errors/app-error');

function validateCreateObject(req, res, next){
    if (!req.body.modelNumber){
        ErrorResponse.message = 'Something went wrong while creating airplane';
        ErrorResponse.error =  new AppError(['Model Number not found in the incoming request in the correct format'], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    else next();
}

function validateUpdateObject(req, res, next){
    if ( !(req.body.modelNumber||req.body.capacity) ){
        ErrorResponse.message = 'Something went wrong while updating the airplane';
        ErrorResponse.error =  new AppError(['Model Numeber And capacity not found in the incoming request in correct format'], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    else next();
}

module.exports = {
    validateCreateObject,
    validateUpdateObject
}