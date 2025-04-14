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
				type: DataTypes.ENUM({
                    values: [PENDING, SUCCESS, FAILED]
                }),
				allowNull: false,
				defaultValue: PENDING,
			},
        }, 
        {
            sequelize,
            modelName: "Ticket",
            tableName: "tickets",
        }
    );
    return Ticket;
};
