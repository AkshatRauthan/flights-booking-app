"use strict";
const { Model } = require("sequelize");

const { ENUMS } = require('../utils/common');
const { ACTIVE, INACTIVE } = ENUMS.AIRLINE_STATUS;

module.exports = (sequelize, DataTypes) => {
    class Airline extends Model {
        static associate(models) {
            this.hasMany(models.AirlineAdmin, {
                foreignKey: "airline_id",
                onDelete: "cascade",
            })
        }
    }
    Airline.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            iataCode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: {
                        args: [2,2], // min, max length
                        msg: "IATA code must be of exactly two chatacters"
                    },
                    isAlphanumeric: true,
                }
            },
            icaoCode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: {
                        args: [3,3], // min, max length
                        msg: "ICAO code must be of exactly three chatacters"
                    },
                }
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'India',
                validate: {
                    isAlpha: true
                }
            },
            contactNo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: {
                        args: [10,12],
                        msg: "Please enter a valid contact number"
                    }
                }
            },
            status: {
                type: DataTypes.ENUM,
                values: [ ACTIVE, INACTIVE ],
                allowNull: false,
            },
            logoIcon: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isUrl: {
                        msg: "Please enter a valid logo url"
                    }
                }
            }
        },
        {
            sequelize,
            modelName: "Airline",
            tableName: "airlines"
        }
    );
    return Airline;
};
