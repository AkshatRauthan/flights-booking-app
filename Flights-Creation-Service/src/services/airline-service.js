const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const axios = require('axios');
const { ServerConfig } = require('../config');
const { API_GATEWAY } = ServerConfig;
const db = require("../models");
const {v4 : uuid} = require("uuid")

const { USER_ROLES_ENUMS } = require('../utils/common/enums');
const { CUSTOMER, AIRLINE_ADMIN, SYSTEM_ADMIN } = USER_ROLES_ENUMS;

const {AirlineRepository, AirlineAdminRepository} = require("../repositories");

const airlineRepository = new AirlineRepository();
const airlineAdminRepository = new AirlineAdminRepository();
const { AIRLINE_STATUS } = require('../utils/common/enums');

const { ServiceAuthFunctions } = require("../utils/common/");
const { generateServiceToken } = ServiceAuthFunctions;

async function registerAirlines(data){
    const transaction = await db.sequelize.transaction();
    try {
        const airlineObject = {
            name: data.name,
            email: data.email,
            iataCode: data.iataCode,
            icaoCode: data.icaoCode,
            country: data.country,
            contactNo: data.contactNo,
            status: data.status
        }
        if (data.logoIcon) airlineObject["logoIcon"] = data.logoIcon;

        const airline = await airlineRepository.registerAirline(airlineObject, {transaction: transaction});
        
        // API request
        const userPayload = {
            email: data.email,
            password: data.password,
            isAirlineAdmin: true,
        };

        let user = await axios.post(`${API_GATEWAY}/api/v1/internal/auth/signup`,userPayload,{
            headers: {
                "Content-Type": "application/json",
                "x-service-token": await generateServiceToken(),
            }
        });

        console.log("------------");
        console.log(user);
        user = user.data.data;
        console.log("------------");
        console.log(user);
        console.log("------------");
        console.log(airline.dataValues);
        console.log("------------");
        const airlineAdmin = await airlineAdminRepository.registerAirlineAdmin({
            user_id: user.id,
            airline_id: airline.dataValues.id,
        }, transaction);
        return airline;
    } catch (error) {
        console.log(error);
        transaction.rollback();
        if (error instanceof AppError) throw error;
        return new AppError("Something went wrong while registering the airline",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirline(data, id){
    const transaction = await db.sequelize.transaction();
    try {
        console.log(data);
        const airline = await airlineRepository.updateAirline(data, id, transaction);
        if (!airline || airline.length === 0) {
            return new AppError("Airline not found", StatusCodes.NOT_FOUND);
        }
        transaction.commit();
        return airline;
    } catch (error) {
        console.log(error);
        transaction.rollback();
        if (error instanceof AppError) throw error;
        return new AppError("Something went wrong while updating the airline",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirlineById(id){
    const transaction = await db.sequelize.transaction();
    try {
        const airline = await airlineRepository.getAirlineById(id, transaction);
        transaction.commit();
        return airline;
    } catch (error) {
        console.log(error);
        transaction.rollback();
        if (error instanceof AppError) throw error;
        return new AppError("Something went wrong while fetching the airline",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    registerAirlines,
    updateAirline,
    getAirlineById,
}