"use strict";
const { Op } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Airports", [
            { name: "Indira Gandhi International Airport", code: "DEL", cityId: 1, createdAt: new Date(), updatedAt: new Date() },
            { name: "Safdarjung Airport", code: "VIST", cityId: 1, createdAt: new Date(), updatedAt: new Date() },
            { name: "Chhatrapati Shivaji Maharaj International Airport", code: "BOM", cityId: 2, createdAt: new Date(), updatedAt: new Date() },
            { name: "Juhu Aerodrome", code: "VAJJ", cityId: 2, createdAt: new Date(), updatedAt: new Date() },
            { name: "Kempegowda International Airport", code: "BLR", cityId: 3, createdAt: new Date(), updatedAt: new Date() },
            { name: "HAL Bangalore International Airport", code: "VOBG", cityId: 3, createdAt: new Date(), updatedAt: new Date() },
            { name: "Rajiv Gandhi International Airport", code: "HYD", cityId: 4, createdAt: new Date(), updatedAt: new Date() },
            { name: "Begumpet Airport", code: "VOHY", cityId: 4, createdAt: new Date(), updatedAt: new Date() },
            { name: "Chennai International Airport", code: "MAA", cityId: 5, createdAt: new Date(), updatedAt: new Date() },
            { name: "Netaji Subhas Chandra Bose International Airport", code: "CCU", cityId: 6, createdAt: new Date(), updatedAt: new Date() },
            { name: "Pune International Airport", code: "PNQ", cityId: 7, createdAt: new Date(), updatedAt: new Date() },
            { name: "Sardar Vallabhbhai Patel International Airport", code: "AMD", cityId: 8, createdAt: new Date(), updatedAt: new Date() },
            { name: "Jaipur International Airport", code: "JAI", cityId: 9, createdAt: new Date(), updatedAt: new Date() },
            { name: "Chaudhary Charan Singh International Airport", code: "LKO", cityId: 10, createdAt: new Date(), updatedAt: new Date() }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Airports", {
            [Op.or]: [
                { code: "DEL" },
                { code: "VIST" },
                { code: "BOM" },
                { code: "VAJJ" },
                { code: "BLR" },
                { code: "VOBG" },
                { code: "HYD" },
                { code: "VOHY" },
                { code: "MAA" },
                { code: "CCU" },
                { code: "PNQ" },
                { code: "AMD" },
                { code: "JAI" },
                { code: "LKO" }
            ],
        });
    },
};
