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
        SuccessResponse.data = user;
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
};