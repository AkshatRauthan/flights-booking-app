"use strict";
const { Model } = require("sequelize");

const bycrypt = require("bcrypt");
const ServerConfig = require("../config/server-config");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
        }
    }
    User.init(
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "User",
        }
    );

    User.beforeCreate(function encrypt(user) {
        const encryptedPassword = bycrypt.hashSync(user.password, Number(ServerConfig.SALT_ROUNDS));
        user.password = encryptedPassword;
    })
    return User;
};
