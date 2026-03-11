'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addIndex('Tickets', ['status'], {
            name: 'idx_tickets_status',
        });
        await queryInterface.addIndex('Tickets', ['recipientEmail'], {
            name: 'idx_tickets_recipientEmail',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('Tickets', 'idx_tickets_status');
        await queryInterface.removeIndex('Tickets', 'idx_tickets_recipientEmail');
    },
};
