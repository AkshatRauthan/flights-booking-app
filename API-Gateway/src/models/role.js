const { ENUMS } = require("../utils/common");
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = ENUMS.USER_ROLES_ENUMS;

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            this.belongsToMany( models.USER, {
				through: models.User_Role,
				as: 'user', 
			})
        }
    }
    Role.init(
        {
            name: {
				type: DataTypes.ENUM({
					values: [ADMIN, CUSTOMER, FLIGHT_COMPANY],
				}),
				allowNull: false,
				defaultValue: CUSTOMER,
			}
        },
        {
            sequelize, 
            modelName: "Role",
            tableName: "roles",
        }
    );
    return Role;
};
