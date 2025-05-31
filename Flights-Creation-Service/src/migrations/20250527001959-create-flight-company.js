"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("flight_companies", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isAlphanumeric: true
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("flight_companies");
    },
};
