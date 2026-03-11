'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addIndex('Bookings', ['userId'], {
            name: 'idx_bookings_userId',
        });
        await queryInterface.addIndex('Bookings', ['flightId'], {
            name: 'idx_bookings_flightId',
        });
        await queryInterface.addIndex('Bookings', ['status'], {
            name: 'idx_bookings_status',
        });
        await queryInterface.addIndex('Seat_Bookings', ['bookingId'], {
            name: 'idx_seatbookings_bookingId',
        });
        await queryInterface.addIndex('Seat_Bookings', ['flightId'], {
            name: 'idx_seatbookings_flightId',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('Bookings', 'idx_bookings_userId');
        await queryInterface.removeIndex('Bookings', 'idx_bookings_flightId');
        await queryInterface.removeIndex('Bookings', 'idx_bookings_status');
        await queryInterface.removeIndex('Seat_Bookings', 'idx_seatbookings_bookingId');
        await queryInterface.removeIndex('Seat_Bookings', 'idx_seatbookings_flightId');
    },
};
