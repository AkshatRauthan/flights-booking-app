"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class AirlineAdmin extends Model {
        static associate(models) {
            this.belongsTo(models.Airline, {
                foreignKey: "airline_id",
                onDelete:'cascade'
            });
        }
    }
    AirlineAdmin.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            airline_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "AirlineAdmin",
            tableName: "airline_admins"
        }
    );
    return AirlineAdmin;
};
