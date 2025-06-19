"use strict";

const ENUMS = require("../utils/common/enums");
const { BOOKED, CANCELLED, INITIATED, PENDING } = ENUMS.BOOKING_STATUS;

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
        }
    }
    Booking.init(
        {
            flightId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM,
                values: [ BOOKED, CANCELLED, INITIATED, PENDING ],
                allowNull: false,
                defaultValue: INITIATED,
            },
            totalCost: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            noOfSeats: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
        },
        {
            sequelize,
            modelName: "Booking",
            tableName: "bookings"
        }
    );
    return Booking;
};
