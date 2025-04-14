const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');

async function isAdmin(req, res, next){
    const response = await UserService.isAdmin(req.user.id);
    if (!response){
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({
                message: 'You are not authorized to perform this action'
            });
    }
    next();
}

module.exports = {
    isAdmin,
}