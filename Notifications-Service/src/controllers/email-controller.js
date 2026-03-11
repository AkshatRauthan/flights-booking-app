const { EmailService } = require('../services')

const AppError = require('../utils/errors/app-error')
const { createSuccessResponse, createErrorResponse } = require("../utils/common");
const { StatusCodes } = require('http-status-codes');

async function createTicket(req, res){
    try {
        const response = await EmailService.createTicket({
            subject: req.body.subject,
            content: req.body.content,
            recipientEmail: req.body.recipientEmail
        });
        return res
                .status(StatusCodes.OK)
                .json(createSuccessResponse(response));
    } catch (error) { 
        return res
                .status(error.statusCode)
                .json(createErrorResponse(error));
    }
}

module.exports = {
    createTicket,
}