"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User_Role extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            this.belongsTo(models.Role, {
                foreignKey: "roleId",
                as: "role",
            });
        }
    }
    User_Role.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
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
