"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint('airports',{
            type: 'FOREIGN KEY',
            fields: ['cityId'],
            name: 'city_fkey_constraint',
            references : {
                table: 'cities',
                field: 'id'
            },
            onDelete: 'cascade'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('airports', 'city_fkey_constraint');
    },
};
