"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const ServerConfig = require("../config/server-config");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            this.belongsToMany(models.Role, {
                through: models.User_Role,
                foreignKey: "userId",
                otherKey: "roleId",
                as: "roles",
            });
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
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
        }
    );

    User.beforeCreate((user) => {
        const encryptedPassword = bcrypt.hashSync(user.password, Number(ServerConfig.SALT_ROUNDS));
        user.password = encryptedPassword;
    });

    return User;
};
