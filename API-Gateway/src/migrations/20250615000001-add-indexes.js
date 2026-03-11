'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addIndex('Users', ['email'], {
            unique: true,
            name: 'idx_users_email',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('Users', 'idx_users_email');
    },
};
