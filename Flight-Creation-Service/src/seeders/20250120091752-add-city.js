"use strict";
const { Op } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Cities", [
            { name: "Delhi", createdAt: new Date(), updatedAt: new Date() },
            { name: "Mumbai", createdAt: new Date(), updatedAt: new Date() },
            { name: "Bangalore", createdAt: new Date(), updatedAt: new Date() },
            { name: "Hyderabad", createdAt: new Date(), updatedAt: new Date() },
            { name: "Chennai", createdAt: new Date(), updatedAt: new Date() },
            { name: "Kolkata", createdAt: new Date(), updatedAt: new Date() },
            { name: "Pune", createdAt: new Date(), updatedAt: new Date() },
            { name: "Ahmedabad", createdAt: new Date(), updatedAt: new Date() },
            { name: "Jaipur", createdAt: new Date(), updatedAt: new Date() },
            { name: "Lucknow", createdAt: new Date(), updatedAt: new Date() },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Cities", {
            [Op.or]: [
                { name: "Delhi" },
                { name: "Mumbai" },
                { name: "Bangalore" },
                { name: "Hyderabad" },
                { name: "Chennai" },
                { name: "Kolkata" },
                { name: "Pune" },
                { name: "Ahmedabad" },
                { name: "Jaipur" },
                { name: "Lucknow" },
            ],
        });
    },
};
