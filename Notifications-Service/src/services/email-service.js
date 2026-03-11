const { TicketRepository } = require('../repositories');
const { Mailer } = require('../config');
const { Logger } = require('../config');
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require('http-status-codes');

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

module.exports = {
    sendEmail,
    createTicket,
    getPendingEmails,
}