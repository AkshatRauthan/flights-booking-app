const { TicketRepository } = require('../repositories');
const { Mailer, Logger, ServerConfig } = require('../config');
const { Ticket } = require('../models');
const { ENUMS } = require('../utils/common');
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require('http-status-codes');

const { FAILED, SUCCESS } = ENUMS.TICKET_STATUS_ENUMS;

const ticketRepository = new TicketRepository();

async function sendEmail(mailFrom, mailTo, subject, text){
    try {
        const response = await Mailer.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: subject,
            text: text 
        })
        return response;
    } catch (error) {
        Logger.error(error)
        throw error;
    }
}

async function createTicket(data){
    try {
        const response = await ticketRepository.create(data);
        return response;
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error(error);
        throw new AppError("Cannot create a new Ticket Object.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getPendingEmails(){
    try {
        const response = await ticketRepository.getPendingTickets();
        return response;
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error(error);
        throw new AppError("Cannot create a new Ticket Object.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function retryFailedEmails() {
    const failedTickets = await Ticket.findAll({
        where: { status: FAILED },
        limit: 10,
    });
    for (const ticket of failedTickets) {
        try {
            await sendEmail(ServerConfig.GMAIL_EMAIL, ticket.recipientEmail, ticket.subject, ticket.content);
            await ticket.update({ status: SUCCESS });
            Logger.info(`Retry successful for ticket ${ticket.id}`);
        } catch (error) {
            Logger.error(`Retry failed for ticket ${ticket.id}`, error);
        }
    }
    return failedTickets.length;
}

module.exports = {
    sendEmail,
    createTicket,
    getPendingEmails,
    retryFailedEmails,
}