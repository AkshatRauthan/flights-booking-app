const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const axios = require('axios');
const { ServerConfig } = require('../config');
const { API_GATEWAY } = ServerConfig;
const db = require("../models");

const { AirlineAdminRepository } = require("../repositories");
const airlineAdminRepository = new AirlineAdminRepository();

async function registerAirlineAdmin(data){
    const transaction = await db.sequelize.transaction();
    try {
        let user = await axios.post(`${API_GATEWAY}/api/v1/user/signup`, {
            email: data.email,
            password: data.password,
        });
        user = user.data.data;

        const airlineAdmin = await airlineAdminRepository.registerAirlineAdmin({
            user_id: user.id,
                airline_id: data.airline_id,
        }, transaction);

        return airlineAdmin;
    } catch (error) {
        console.log(error);
        transaction.rollback();
        if (error instanceof AppError) throw error;
        return new AppError("Something went wrong while registering the airline",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function validateAirlineAdmin(id, airlineId) {
    try {
        const airlineAdmin = await airlineAdminRepository.validateAirlineAdmin(id, airlineId);
        console.log(airlineAdmin);
        if (!airlineAdmin) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        transaction.rollback();
        if (error instanceof AppError) throw error;
        return new AppError("Something went wrong while validating the airline admin", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    registerAirlineAdmin,
    validateAirlineAdmin,
}