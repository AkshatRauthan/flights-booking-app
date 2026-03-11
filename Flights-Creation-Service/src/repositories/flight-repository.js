const CrudRepsitory= require('./crud-repositories');
const { Airplane, Airport, City, Flight } = require('../models')
const { Sequelize, Op } = require('sequelize');
const db = require("../models");
const { addingRowLockOnFlights } = require("./queries");
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');

class FlightRepository extends CrudRepsitory {
    constructor(){
        super(Flight)
    }

    async getAllFlights(filter, sort, pagination = {}){
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Flight.findAndCountAll({
            where: filter,
            order: sort,
            limit,
            offset,
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
        return {
            flights: rows,
            pagination: {
                page,
                limit,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
            },
        };
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
                await flight.decrement('totalSeats', {by: seats, transaction: transaction});
            } else if (dec == false){
                await flight.increment('totalSeats', {by: seats, transaction: transaction});
            }
            
            await transaction.commit();
            return flight.reload();
        } catch (error) {
            await transaction.rollback();
            Logger.error(error);
            throw error;
        }
    }
};

module.exports = FlightRepository;