const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { AuthService } = require('../services');
const { createSuccessResponse, createErrorResponse } = require('../utils/common');
const { USER_ROLES_ENUMS } = require('../utils/common/enums');
const { CUSTOMER, AIRLINE_ADMIN, SYSTEM_ADMIN } = USER_ROLES_ENUMS;
const { Logger } = require('../config');

/*
POST : /signup
    req-body : {
        email: "alan123@gmail.com",
        password: "1234",
    }
*/
async function createUser(req, res){
    try {
        let obj = {
            email: req.body.email,
            password: req.body.password,
        };
        obj["role"] = (req.body.isDatabaseAdmin)? SYSTEM_ADMIN: ((req.body.isAirlineAdmin)? AIRLINE_ADMIN: CUSTOMER);
        const user = await AuthService.createUser(obj);
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse({ id: user.id, email: user.email }, 'User created successfully'));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

/*
POST : /signin
    req-body : {
        email: "alan123@gmail.com",
        password: "1234",
    }
*/
async function authenticateUser(req, res){
    try {
        const user = await AuthService.authenticateUser({
            email: req.body.email,
            password: req.body.password,
        });
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(user, 'User authenticated successfully'));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}


module.exports = {
    createUser,
    authenticateUser,
}