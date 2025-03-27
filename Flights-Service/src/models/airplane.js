"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Airplane extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
        */
        static associate(models) {
            this.hasMany(models.Flight, {
                foreignKey:'id',
                onDelete:'cascade'
            }),
            this.hasMany(models.Seat, {
                foreignKey: 'airplaneId'
            })
        }
    }
    Airplane.init({
            modelNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isAlphanumeric: true,
                },
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 1000,
                },
            },
        }, {
            sequelize,
            modelName: "Airplane",
            tableName: "airplanes"
        }
    );
    return Airplane;
};
