"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Seats", [{
            airplaneId: 1,
            row: 1,
            col: 'A',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 1,
            col: 'B',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 1,
            col: 'C',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 1,
            col: 'D',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 1,
            col: 'E',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 1,
            col: 'F',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 2,
            col: 'A',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 2,
            col: 'B',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 2,
            col: 'C',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 2,
            col: 'D',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 2,
            col: 'E',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 2,
            col: 'F',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 3,
            col: 'A',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 3,
            col: 'B',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 3,
            col: 'C',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 3,
            col: 'D',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 3,
            col: 'E',
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            airplaneId: 1,
            row: 3,
            col: 'F',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ]);
    },

    async down(queryInterface, Sequelize) {
        
    },
};
