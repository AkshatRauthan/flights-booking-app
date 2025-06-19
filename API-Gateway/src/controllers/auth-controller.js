const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { AuthService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { USER_ROLES_ENUMS } = require('../utils/common/enums');
const { CUSTOEMR, AIRLINE_ADMIN, SYSTEM_ADMIN } = USER_ROLES_ENUMS;

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
        obj["role"] = (req.body.isDatabaseAdmin)? SYSTEM_ADMIN: ((req.body.isAirlineAdmin)? AIRLINE_ADMIN: CUSTOEMR);
        const user = await AuthService.createUser(obj);
        SuccessResponse.data = {
            id: user.id,
            email: user.email
        };
        SuccessResponse.message = 'User created successfully';
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
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
        SuccessResponse.data = user;
        SuccessResponse.message = 'User authenticated successfully';
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}


module.exports = {
    createUser,
    authenticateUser,
}