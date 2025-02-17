const CrudRepsitory= require('./crud-repositories');
const { Airplane, Airport, City, Flight } = require('../models')
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

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

    async updateRemainingSeat(flightId, seats, dec=true) {
        const flight = await Flight.findByPk(flightId);
        if(dec == true){
            console.log('Decrement');
            await flight.decrement('totalSeats', {by: seats});
        } else {
            console.log('Increment');
            await flight.increment('totalSeats', {by: seats});
        }
        return flight.reload();
    }
};

module.exports = FlightRepository;