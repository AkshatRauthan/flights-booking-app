"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("seat_bookings", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                }
            },
            seat_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "seats",
                    key: "id",
                }
            },
            booking_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "bookings",
                    key: "id",
                }
            },
            flight_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "flights",
                    key: "id",
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
        await queryInterface.addIndex("seat_bookings", {
            unique: true,
            fields: ["seat_id", "flight_id"],
            name: "unique_seat_flight",
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex("seat_bookings", "unique_seat_flight");
        await queryInterface.dropTable("seat_bookings");
    },
};
