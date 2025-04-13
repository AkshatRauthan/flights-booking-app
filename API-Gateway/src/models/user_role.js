"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User_Role extends Model {
        static associate(models) {
            // Associations are defined in User and Role models
        }
    }
    User_Role.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "roles",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            modelName: "User_Role",
            tableName: "user_roles",
        }
    );
    return User_Role;
};
