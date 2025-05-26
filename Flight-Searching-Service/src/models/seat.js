"use strict";

const { Model } = require("sequelize");
const { ENUMS } = require('../utils/common');
const {BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS} = ENUMS.SEAT_TYPES;
module.exports = (sequelize, DataTypes) => {
    class Seat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    Seat.init({
            row: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            col: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM,
                values: [BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS],
                defaultValue: ECONOMY,
                allowNull: false,
            },
        },{
            sequelize,
            modelName: "Seat",
            tableName: "seats"
        }
    );
    return Seat;
};
