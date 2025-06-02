const { ENUMS } = require("../utils/common");
const { SYSTEM_ADMIN, CUSTOMER, AIRLINE_ADMIN } = ENUMS.USER_ROLES_ENUMS;

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            this.belongsToMany(models.User, {
                through: models.User_Role,
                foreignKey: "roleId",
                otherKey: "userId",
                as: "users",
            });
        }
    }
    Role.init(
        {
            name: {
                type: DataTypes.ENUM({
                    values: [SYSTEM_ADMIN, CUSTOMER, AIRLINE_ADMIN],
                }),
                allowNull: false,
                defaultValue: CUSTOMER,
            },
        },
        {
            sequelize,
            modelName: "Role",
            tableName: "roles",
        }
    );

    return Role;
};
