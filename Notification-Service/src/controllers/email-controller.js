const { EmailService } = require('../services')

const AppError = require('../utils/errors/app-error')
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require('http-status-codes');

async function createTicket(req, res){
    try {
        const response = await EmailService.createTicket({
            subject: req.body.subject,
            content: req.body.content,
            recipientEmail: req.body.recipientEmail
        });
        SuccessResponse.data = response;
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

module.exports = {
    createTicket,
}