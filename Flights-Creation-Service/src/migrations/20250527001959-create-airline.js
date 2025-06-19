"use strict";

const { ENUMS } = require("../utils/common");
const { ACTIVE, INACTIVE } = ENUMS.AIRLINE_STATUS;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("airlines", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            iataCode: {
                type: Sequelize.CHAR(2),
                allowNull: false,
                unique: true,
            },
            icaoCode: {
                type: Sequelize.CHAR(3),
                allowNull: false,
                unique: true,
            },
            country: {
                type: Sequelize.CHAR(50),
                allowNull: false,
                defaultValue: "India",
            },
            contactNo: {
                type: Sequelize.STRING(12),
                allowNull: false,
                unique: true,
            },
            status: {
                type: Sequelize.ENUM,
                values: [ACTIVE, INACTIVE],
                allowNull: false,
            },
            logoIcon: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("airlines");
    },
};
