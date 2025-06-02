"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const timestamp = new Date();

        await queryInterface.bulkInsert("roles", [
            {
                name: "system_admin",
                createdAt: timestamp,
                updatedAt: timestamp,
            },
            {
                name: "customer",
                createdAt: timestamp,
                updatedAt: timestamp,
            },
            {
                name: "airline_admin",
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("roles", {
            name: ["system_admin", "customer", "airline_admin"],
        });
    },
};
