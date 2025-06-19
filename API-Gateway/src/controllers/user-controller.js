const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { USER_ROLES_ENUMS } = require('../utils/common/enums');
const { CUSTOEMR, AIRLINE_ADMIN, SYSTEM_ADMIN } = USER_ROLES_ENUMS;

async function updateUserEmailById(req, res){
    try {
        const user = await UserService.updateUserEmailById({
            userId: req.params.id,
            newEmail: req.body.newEmail,
            // password: req.body.password,
        });
        SuccessResponse.data = user;
        SuccessResponse.message = 'User email updated successfully';
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

async function updateUserPasswordById(req, res){
    try {
        const user = await UserService.updateUserPasswordById({
            userId: req.params.id,
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword,
        });
        SuccessResponse.data = user;
        SuccessResponse.message = 'User password updated successfully';
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

async function deleteUserById(req, res){
    try {
        const user = await UserService.deleteUserById(req.params.id);
        SuccessResponse.data = user;
        SuccessResponse.message = 'Role Added to User Successfully';
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
POST : /role
    req-body : {
        id: 1,
        roleName: "admin" Or "customer" Or "flight_company"
    }
*/
async function addRoleToUser(req, res){
    try {
        const user = await UserService.addRoleToUser({
            userId: req.body.id,
            roleName: req.body.roleName,
        });
        SuccessResponse.data = user;
        SuccessResponse.message = 'Role Added to User Successfully';
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
GET : /:id/email
    To fetch the email of users to send them emails.
*/
async function getUserEmailById(req, res){
    try {
        const response = await UserService.getUserEmailById({
            userId: req.params.id,
        });
        SuccessResponse.data = response;
        SuccessResponse.message = 'Email found successfully';
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function isValidUser(req, res) {
    try {
        const id = req.body.id;
        const isValid = await UserService.isValidUser(id);
        SuccessResponse.message = isValid ? "Requested Used is valid" : "Requested Used is not valid";
        SuccessResponse.data = { 
            isValid: isValid,
        }
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error){
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    addRoleToUser,
    getUserEmailById,
    isValidUser,
    deleteUserById,
    updateUserEmailById,
    updateUserPasswordById,
};