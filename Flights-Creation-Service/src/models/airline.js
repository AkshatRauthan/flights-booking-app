"use strict";
const { Model } = require("sequelize");
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
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isAlphanumeric: true,
                }
            },
        },
        {
            sequelize,
            modelName: "Airline",
            tableName: "airlines"
        }
    );
    return Airline;
};
