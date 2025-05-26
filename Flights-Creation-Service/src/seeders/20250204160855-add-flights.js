"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Flights", [
            {
                flightNumber: "UK 1024",
                airplaneId: 1,
                departureAirportId: "BOM",
                arrivalAirportId: "DEL",
                arrivalTime: "2025-02-04 22:08:55",
                departureTime: "2025-02-04 06:08:55",
                price: 5000,
                totalSeats: 180,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                flightNumber: "IN 1845",
                airplaneId: 3,
                departureAirportId: "BLR",
                arrivalAirportId: "HYD",
                departureTime: "2025-02-04 02:30:30",
                arrivalTime: "2025-02-04 22:45:00",
                price: 8000,
                totalSeats: 210,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Flights", {
            [Op.or]: [
                { flightNumber: "UK 1024" },
                { flightNumber: "IN 1845" },
            ],
        });
    },
};