const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');
const { createSuccessResponse, createErrorResponse } = require('../utils/common');
const { USER_ROLES_ENUMS } = require('../utils/common/enums');
const { CUSTOMER, AIRLINE_ADMIN, SYSTEM_ADMIN } = USER_ROLES_ENUMS;
const { Logger } = require('../config');

async function updateUserEmailById(req, res){
    try {
        const user = await UserService.updateUserEmailById({
            userId: req.params.id,
            newEmail: req.body.newEmail,
            // password: req.body.password,
        });
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(user, 'User email updated successfully'));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

async function updateUserPasswordById(req, res){
    try {
        const user = await UserService.updateUserPasswordById({
            userId: req.params.id,
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword,
        });
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(user, 'User password updated successfully'));
    } catch (error) {
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

async function deleteUserById(req, res){
    try {
        const user = await UserService.deleteUserById(req.params.id);
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(user, 'User deleted successfully'));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
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
        return res
                .status(StatusCodes.CREATED)
                .json(createSuccessResponse(user, 'Role Added to User Successfully'));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
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
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response, 'Email found successfully'));
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

async function isValidUser(req, res) {
    try {
        const id = req.body.id;
        const isValid = await UserService.isValidUser(id);
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(
                    { isValid: isValid },
                    isValid ? "Requested Used is valid" : "Requested Used is not valid"
                ));
    } catch (error){
        Logger.error(error);
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
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