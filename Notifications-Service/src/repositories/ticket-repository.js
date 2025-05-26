const CrudRepsitory= require('./crud-repository');
const { ENUMS } = require('../utils/common')
const { Ticket } = require('../models')

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
            console.log(error);
            throw error;
        }
    }
};

module.exports = TicketRepository