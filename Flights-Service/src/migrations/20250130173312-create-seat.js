"use strict";

const { ENUMS } = require('../utils/common');
const {BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS} = ENUMS.SEAT_TYPES;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Seats", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            row: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            col: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM,
                values: [BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS],
                defaultValue: ECONOMY,
            },
            airplaneId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Airplanes',
                    key: 'id'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Seats");
    },
};
