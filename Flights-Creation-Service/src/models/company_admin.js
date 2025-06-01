"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CompanyAdmin extends Model {
        static associate(models) {
            this.belongsTo(models.FlightCompany, {
                foreignKey: "company_id",
                onDelete:'cascade'
            });
        }
    }
    CompanyAdmin.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            company_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "CompanyAdmin",
            tableName: "company_admins"
        }
    );
    return CompanyAdmin;
};
