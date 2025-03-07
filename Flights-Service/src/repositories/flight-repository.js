const CrudRepsitory= require('./crud-repositories');
const { Airplane, Airport, City, Flight } = require('../models')
const { Sequelize, Op } = require('sequelize');
const db = require("../models");
const { addingRowLockOnFlights } = require("./queries");

class FlightRepository extends CrudRepsitory {
    constructor(){
        super(Flight)
    }

    async getAllFlights(filter, sort){
        const response = await Flight.findAll({
            where: filter,
            order: sort,
            include : [
                {
                    model: Airplane,
                    required: true
                },
                {
                    model: Airport,
                    as: 'arrivalAirport',
                    on: {
                        '$Flight.arrivalAirportId$': { [Op.eq]: Sequelize.col('arrivalAirport.code') },
                    },
                    include: {
                        model: City,
                    }
                },
                {
                    model: Airport,
                    as: 'departureAirport',
                    on: {
                        '$Flight.departureAirportId$': { [Op.eq]: Sequelize.col('departureAirport.code') },
                    },
                    include: {
                        model: City,
                    }
                }
            ]
        });
        return response;
    }
    
    async updateRemainingSeat(flightId, seats, dec) {
        const transaction = await db.sequelize.transaction();
        try {
            await db.sequelize.query(addingRowLockOnFlights(flightId));
            const flight = await Flight.findByPk(flightId);
            if(dec == true){
                await flight.decrement('totalSeats', {by: seats}, {transaction: transaction});
            } else if (dec == false){
                await flight.increment('totalSeats', {by: seats}, {transaction: transaction});
            }
            
            await transaction.commit();
            return flight.reload();
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            throw error;
        }
    }
};

module.exports = FlightRepository;