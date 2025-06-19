const { AirlineServices } = require('../services');

const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse, ENUMS } = require('../utils/common');

async function registerAirlines(req, res) {
    try {
        const response = await AirlineServices.registerAirlines({
            name: req.body.name,
            email: req.body.email,
            iataCode: req.body.iataCode,
            icaoCode: req.body.icaoCode,
            country: req.body.country,
            contactNo: req.body.contactNo,
            logoIcon: req.body.logoIcon,
            password: req.body.adminPassword,
            status: ENUMS.AIRLINE_STATUS.ACTIVE
        });
        SuccessResponse.message = "Successfully registered the airline and created its admin account";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.message("Something went wrong while processing your request.")
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function updateAirline(req, res){
    
    try {
        let obj = {};
        console.log(req.body);
        if (req.body.name) obj["email"] = req.body.email;
        if (req.body.email) obj["email"] = req.body.email;
        if (req.body.country) obj["country"] = req.body.country;
        if (req.body.contactNo) obj["contactNo"] = req.body.contactNo;
        if (req.body.logoIcon) obj["logoIcon"] = req.body.logoIcon;
        if (req.body.adminPassword) obj["adminPassword"] = req.body.adminPassword;
        if (req.body.status) obj["status"] = req.body.status;

        const response = await AirlineServices.updateAirline(obj, req.params.id);

        SuccessResponse.message = "Successfully updated the airline";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.message = "Something went wrong while processing your request.";
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function getAirlineById(req, res){
    try {
        const response = await AirlineServices.getAirlineById(req.params.id);
        SuccessResponse.message = "Successfully fetched the airline";
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.message = "Something went wrong while processing your request.";
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    registerAirlines,
    updateAirline,
    getAirlineById
}