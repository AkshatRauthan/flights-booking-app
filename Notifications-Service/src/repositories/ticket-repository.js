const CrudRepsitory= require('./crud-repository');
const { ENUMS } = require('../utils/common')
const { Ticket } = require('../models')
const { Logger } = require('../config');

const { PENDING, SUCCESS, FAILED } = ENUMS;

class TicketRepository extends CrudRepsitory {
    constructor(){
        super(Ticket)
    }

    async getPendingTickets(){
        try {
            const response = await Ticket.findAll({
                where: {
                    status: PENDING 
                }
            })
            return response;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }
};

module.exports = TicketRepository