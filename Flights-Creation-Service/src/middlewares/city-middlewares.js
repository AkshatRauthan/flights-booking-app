const { StatusCodes } = require('http-status-codes');

const { createErrorResponse } = require('../utils/common');

const AppError = require('../utils/errors/app-error');

function validateCreateObject(req, res, next){
    if (!req.body.name){
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(createErrorResponse(new AppError(['Name not found in the incoming request in the correct format'], StatusCodes.BAD_REQUEST), 'Something went wrong while creating the city'));
    }
    else next();
}

function validateUpdateObject(req, res, next){
    if (!req.body.name){
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(createErrorResponse(new AppError(['Name not found in the incoming request in correct format'], StatusCodes.BAD_REQUEST), 'Something went wrong while updating the city'));
    }
    else next();
}

module.exports = {
    validateCreateObject,
    validateUpdateObject
}