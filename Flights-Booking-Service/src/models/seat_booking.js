"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Seat_Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: "user_id",
                onDelete: "CASCADE",
            });
            this.belongsTo(models.Seat, {
                foreignKey: "seat_id",
                onDelete: "CASCADE",
            });
            this.belongsTo(models.Booking, {
                foreignKey: "booking_id",
                onDelete: "CASCADE",
            });
            this.belongsTo(models.Flight, {
                foreignKey: "flight_id",
                onDelete: "CASCADE",
            });
        }
    }
    Seat_Booking.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            seat_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            booking_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            flight_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Seat_Booking",
            tableName: "seat_bookings",
            indexes: [
                {
                    unique: true,
                    fields: ["seat_id", "flight_id"],
                    name: "unique_seat_flight"
                }
            ]
        }
    );
    return Seat_Booking;
};
