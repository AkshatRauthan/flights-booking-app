const { StatusCodes } = require('http-status-codes');

const { createErrorResponse } = require('../utils/common');

const AppError = require('../utils/errors/app-error');

function validateCreateObject(req, res, next){
    if (!req.body.modelNumber || !req.body.capacity ){
        let explanation = [];
        if (!req.body.capacity) explanation.push('Capacity not found in the incoming request in the correct format');
        if (!req.body.modelNumber) explanation.push('Model Number not found in the incoming request in the correct format');
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(createErrorResponse(new AppError(explanation, StatusCodes.BAD_REQUEST), 'Something went wrong while creating airplane'));
    }
    else next();
}

function validateUpdateObject(req, res, next){
    if ( !req.body.modelNumber || !req.body.capacity ){
        let explanation = [];
        if (!req.body.modelNumber) explanation.push('Model Number not found in the incoming request in the correct format');
        if (!req.body.capacity) explanation.push('Capacity not found in the incoming request in the correct format');
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(createErrorResponse(new AppError(explanation, StatusCodes.BAD_REQUEST), 'Something went wrong while updating the airplane'));
    }
    else next();
}

module.exports = {
    validateCreateObject,
    validateUpdateObject
}