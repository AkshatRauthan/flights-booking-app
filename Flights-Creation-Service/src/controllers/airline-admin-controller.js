const { AirlineAdminServices } = require('../services');

const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse, ENUMS } = require('../utils/common');

async function registerAirlineAdmin(req, res){
    try {
        const response = await AirlineAdminServices.registerAirlineAdmin({
            email: req.body.email,
            password: req.body.password,
            airline_id: req.params.airlineId
        })
        SuccessResponse.message = "Successfully registered new airline admin account";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.message = "Something went wrong while processing your request"
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    registerAirlineAdmin,
}