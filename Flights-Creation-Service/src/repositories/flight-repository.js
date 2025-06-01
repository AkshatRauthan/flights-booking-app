const CrudRepsitory= require('./crud-repositories');
const { Airplane, Airport, City, Flight } = require('../models')
const { Sequelize, Op } = require('sequelize');
const db = require("../models");
const { addingRowLockOnFlights } = require("./queries");
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

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

    async getFlight(id){
        const response = await Flight.findByPk(id, {
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
        if(!response || response.length === 0){
            throw new AppError("The requested flight is not found", StatusCodes.NOT_FOUND);
        }
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