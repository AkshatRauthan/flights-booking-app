"use strict";
/** @type {import('sequelize-cli').Migration} */

const { ENUMS } = require("../utils/common");
const { SYSTEM_ADMIN, CUSTOMER, AIRLINE_ADMIN } = ENUMS.USER_ROLES_ENUMS;
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("roles", {
            id: {
                allowNull: false, 
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.ENUM,
                values: [SYSTEM_ADMIN, CUSTOMER, AIRLINE_ADMIN],
                allowNull: false,
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
        await queryInterface.dropTable("roles");
    },
}; 
