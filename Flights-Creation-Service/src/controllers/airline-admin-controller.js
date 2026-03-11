const { AirlineAdminServices } = require('../services');

const { StatusCodes } = require('http-status-codes');
const { createErrorResponse, createSuccessResponse, ENUMS } = require('../utils/common');
const { Logger } = require('../config');

async function registerAirlineAdmin(req, res){
    try {
        const response = await AirlineAdminServices.registerAirlineAdmin({
            email: req.body.email,
            password: req.body.password,
            airline_id: req.params.airlineId
        })
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully registered new airline admin account"));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error, "Something went wrong while processing your request"));
    }
}

module.exports = {
    registerAirlineAdmin,
}