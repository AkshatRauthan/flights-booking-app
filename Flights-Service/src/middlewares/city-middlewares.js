const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');

const AppError = require('../utils/errors/app-error');

function validateCreateObject(req, res, next){
    if (!req.body.name){
        ErrorResponse.message = 'Something went wrong while creating the city';
        ErrorResponse.error =  new AppError(['Name not found in the incoming request in the correct format'], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    else next();
}

function validateUpdateObject(req, res, next){
    if (!req.body.name){
        ErrorResponse.message = 'Something went wrong while updating the city';
        ErrorResponse.error =  new AppError(['Name not found in the incoming request in correct format'], StatusCodes.BAD_REQUEST);
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