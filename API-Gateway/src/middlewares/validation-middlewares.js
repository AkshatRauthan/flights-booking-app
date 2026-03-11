const { StatusCodes } = require('http-status-codes');
const { createErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

function validateUpdateEmail(req, res, next) {
    const errors = [];
    if (!req.body.newEmail) errors.push('newEmail is required');
    if (req.body.newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.newEmail)) {
        errors.push('newEmail must be a valid email address');
    }
    if (errors.length > 0) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(createErrorResponse(new AppError(errors, StatusCodes.BAD_REQUEST), 'Invalid email update request'));
    }
    next();
}

function validateUpdatePassword(req, res, next) {
    const errors = [];
    if (!req.body.oldPassword) errors.push('oldPassword is required');
    if (!req.body.newPassword) errors.push('newPassword is required');
    if (req.body.newPassword && req.body.newPassword.length < 6) {
        errors.push('newPassword must be at least 6 characters');
    }
    if (errors.length > 0) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(createErrorResponse(new AppError(errors, StatusCodes.BAD_REQUEST), 'Invalid password update request'));
    }
    next();
}

function validateAddRole(req, res, next) {
    const errors = [];
    if (!req.body.id) errors.push('id (userId) is required');
    if (!req.body.roleName) errors.push('roleName is required');
    const validRoles = ['system_admin', 'customer', 'airline_admin'];
    if (req.body.roleName && !validRoles.includes(req.body.roleName)) {
        errors.push(`roleName must be one of: ${validRoles.join(', ')}`);
    }
    if (errors.length > 0) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(createErrorResponse(new AppError(errors, StatusCodes.BAD_REQUEST), 'Invalid role assignment request'));
    }
    next();
}

function validateIdParam(req, res, next) {
    if (!req.params.id || isNaN(Number(req.params.id))) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(createErrorResponse(new AppError('Valid numeric id parameter is required', StatusCodes.BAD_REQUEST)));
    }
    next();
}

module.exports = {
    validateUpdateEmail,
    validateUpdatePassword,
    validateAddRole,
    validateIdParam,
};
