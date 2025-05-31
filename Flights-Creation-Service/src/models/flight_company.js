"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class FlightCompany extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.CompanyAdmin, {
                foreignKey: "company_id",
                onDelete: "cascade",
            })
        }
    }
    FlightCompany.init(
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
            modelName: "FlightCompany",
            tableName: "flight_companies"
        }
    );
    return FlightCompany;
};
