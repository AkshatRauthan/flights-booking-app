const { StatusCodes } = require('http-status-codes');

const { createErrorResponse } = require('../utils/common');

const AppError = require('../utils/errors/app-error');

function validateCreateObject(req, res, next){
    const{ name, code, address, cityId } = req.body;
    if (!(name && code && cityId)){
        let explanation = [];
        if (!name) explanation.push('Airport name not found in correct format in the incoming request');
        if (!code) explanation.push('Airport code not found in correct format in the incoming request');
        if (!cityId) explanation.push('The city Id of the airport not found in correct format in the incoming request');
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(createErrorResponse(new AppError(explanation, StatusCodes.BAD_REQUEST), 'Something went wrong while creating airport'));
    }
    else next();
}

function validateUpdateObject(req, res, next){
    const{ name, code, address, cityId } = req.body;
    if (!(name && code && cityId)){
        let explanation = [];
        if (!name) explanation.push('Airport name not found in correct format in the incoming request');
        if (!code) explanation.push('Airport code not found in correct format in the incoming request');
        if (!cityId) explanation.push('The city Id of the airport not found in correct format in the incoming request');
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(createErrorResponse(new AppError(explanation, StatusCodes.BAD_REQUEST), 'Something went wrong while updating airport'));
    }
    else next();
}

module.exports = {
    validateCreateObject,
    validateUpdateObject
}