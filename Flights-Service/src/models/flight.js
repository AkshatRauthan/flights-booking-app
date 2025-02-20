"use strict";
const { Model } = require("sequelize");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
module.exports = (sequelize, DataTypes) => {
    class Flight extends Model {
        static associate(models) {
            this.belongsTo(models.Airplane, {
                foreignKey:'airplaneId'
            });
            this.belongsTo(models.Airport, {
                foreignKey:'arrivalAirportId',
                as: 'arrivalAirport', // When creating Joins, the data object fetched from Airport will be named as arrivalAirport
            });
            this.belongsTo(models.Airport, {
                foreignKey:'departureAirportId',
                as: 'departureAirport',
            });
        }
    }
    Flight.init({
        flightNumber: {
            type:DataTypes.STRING,
            allowNull:false
        },
        airplaneId: {
            type:DataTypes.INTEGER,
            allowNull:false
        },
        departureAirportId: {
            type:DataTypes.STRING,
            allowNull:false
        },
        arrivalAirportId: {
            type:DataTypes.STRING,
            allowNull:false
        },
        arrivalTime: {
            type:DataTypes.DATE,
            allowNull:false
        },
        departureTime: {
            type:DataTypes.DATE,
            allowNull:false
        },
        price: {
            type:DataTypes.INTEGER,
            allowNull:false
        },
        boardingGate: {
            type:DataTypes.STRING,
        },
        totalSeats: {
            type:DataTypes.INTEGER,
            allowNull:false
        },
    },{
        sequelize,
        modelName: "Flight",
    });

    Flight.beforeValidate(async (flight, options) => {
        const { Airplane } = sequelize.models;
        const airplane = await Airplane.findByPk(flight.airplaneId);
        if (!airplane) {
            throw new AppError('The requested airplane do not exists.', StatusCodes.BAD_REQUEST);
        }
        flight.totalSeats = airplane.capacity;
    });
    return Flight;
};