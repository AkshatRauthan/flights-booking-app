"use strict";
const { Model } = require("sequelize");
const { ENUMS } = require("../utils/common");
const { PENDING, SUCCESS, FAILED } = ENUMS.TICKET_STATUS_ENUMS;

module.exports = (sequelize, DataTypes) => {
    class Ticket extends Model {
        static associate(models) {
        }
    }
    Ticket.init(
        {
            subject: {
				type: DataTypes.STRING,
				allowNull: false,
            },
            content: {
				type: DataTypes.STRING, 
				allowNull: false,
			},
            recipientEmail: {
				type: DataTypes.STRING,
				allowNull: false,
			},
            status: {
				types: DataTypes.ENUMS,
				allowNull: false,
				values: [PENDING, SUCCESS, FAILED],
				defaultValue: PENDING,
			},
        }, 
        {
            sequelize,
            modelName: "Ticket",
        }
    );
    return Ticket;
};
