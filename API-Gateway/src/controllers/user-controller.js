const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

/*
POST : /signup
    req-body : {
        email: "alan123@gmail.com",
        password: "1234",
    }
*/
async function createUser(req, res){
    try {
        const user = await UserService.createUser({
            email: req.body.email,
            password: req.body.password,
        });
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
        const user = await UserService.authenticateUser({
            email: req.body.email,
            password: req.body.password,
        });
        SuccessResponse.data = user;
        SuccessResponse.message = 'User authenticated successfully';
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
GET : /test
    req-headers : {
        x-acccess-token: authentication-token-value
    } 
*/
async function testAuthentication(req, res) {
    try {
        const response = await UserService.testAuthentication(req.user);
        SuccessResponse.data = req.user;
        SuccessResponse.message = response.message;
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


module.exports = {
    createUser,
    authenticateUser,
    testAuthentication,
};