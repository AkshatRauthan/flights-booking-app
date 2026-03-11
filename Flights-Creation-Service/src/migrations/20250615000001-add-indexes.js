'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addIndex('Flights', ['flightNumber'], {
            unique: true,
            name: 'idx_flights_flightNumber',
        });
        await queryInterface.addIndex('Flights', ['departureAirportId', 'arrivalAirportId'], {
            name: 'idx_flights_route',
        });
        await queryInterface.addIndex('Flights', ['departureTime'], {
            name: 'idx_flights_departureTime',
        });
        await queryInterface.addIndex('Flights', ['price'], {
            name: 'idx_flights_price',
        });
        await queryInterface.addIndex('Airports', ['code'], {
            unique: true,
            name: 'idx_airports_code',
        });
        await queryInterface.addIndex('Airlines', ['iataCode'], {
            unique: true,
            name: 'idx_airlines_iataCode',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('Flights', 'idx_flights_flightNumber');
        await queryInterface.removeIndex('Flights', 'idx_flights_route');
        await queryInterface.removeIndex('Flights', 'idx_flights_departureTime');
        await queryInterface.removeIndex('Flights', 'idx_flights_price');
        await queryInterface.removeIndex('Airports', 'idx_airports_code');
        await queryInterface.removeIndex('Airlines', 'idx_airlines_iataCode');
    },
};
