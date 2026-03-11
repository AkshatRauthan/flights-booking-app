const { AirlineServices } = require('../services');

const { StatusCodes } = require('http-status-codes');
const { createErrorResponse, createSuccessResponse, ENUMS } = require('../utils/common');
const { Logger } = require('../config');

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
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(response, "Successfully registered the airline and created its admin account"));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(createErrorResponse(error, "Something went wrong while processing your request."));
    }
}

async function updateAirline(req, res){
    
    try {
        let obj = {};
        Logger.info(`Update airline request body: ${JSON.stringify(req.body)}`);
        if (req.body.name) obj["email"] = req.body.email;
        if (req.body.email) obj["email"] = req.body.email;
        if (req.body.country) obj["country"] = req.body.country;
        if (req.body.contactNo) obj["contactNo"] = req.body.contactNo;
        if (req.body.logoIcon) obj["logoIcon"] = req.body.logoIcon;
        if (req.body.adminPassword) obj["adminPassword"] = req.body.adminPassword;
        if (req.body.status) obj["status"] = req.body.status;

        const response = await AirlineServices.updateAirline(obj, req.params.id);

        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, "Successfully updated the airline"));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error, "Something went wrong while processing your request."));
    }
}

async function getAirlineById(req, res){
    try {
        const response = await AirlineServices.getAirlineById(req.params.id);
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, "Successfully fetched the airline"));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error, "Something went wrong while processing your request."));
    }
}

module.exports = {
    registerAirlines,
    updateAirline,
    getAirlineById
}