"use strict";
const { Op } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Airplanes", [{
                modelNumber: "airbusA320",
                capacity: 180,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                modelNumber: "boeing737",
                capacity: 210,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                modelNumber: "boeing747",
                capacity: 410,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                modelNumber: "airbusA350",
                capacity: 440,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                modelNumber: "boeing787",
                capacity: 296,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                modelNumber: "airbusA380",
                capacity: 850,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                modelNumber: "boeing777",
                capacity: 396,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                modelNumber: "embraerE190",
                capacity: 114,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                modelNumber: "bombardierCRJ900",
                capacity: 90,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                modelNumber: "boeing757",
                capacity: 239,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Airplanes", {
            [Op.or]: [
                { modelNumber: "airbusA320" },
                { modelNumber: "boeing737" },
                { modelNumber: "boeing747" },
                { modelNumber: "airbusA350" },
                { modelNumber: "boeing787" },
                { modelNumber: "airbusA380" },
                { modelNumber: "boeing777" },
                { modelNumber: "embraerE190" },
                { modelNumber: "bombardierCRJ900" },
                { modelNumber: "boeing757" }
            ],
        });
    },
};
