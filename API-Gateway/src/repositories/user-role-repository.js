const { User_Role, Role } = require('../models');
const { StatusCodes } = require('http-status-codes');
const CrudRepository = require('./crud-repository');
const AppError = require('../utils/errors/app-error');

class UserRoleRepository extends CrudRepository {
    constructor() {
        super(User_Role);
    }

    async deleteUserRoleByUserId(userId, transaction) {
        const deletedUserRole = await User_Role.destroy({
            where: { userId: userId },
            transaction: transaction
        });
        if (deletedUserRole === 0) {
            throw new AppError('No user role found with the given user ID', StatusCodes.NOT_FOUND);
        }
        return deletedUserRole;
    }

    async getUserRoleByUserId(userId, transaction) {
        const userRole = await User_Role.findOne({
            where: { userId: userId },
            include: [
                {
                    model: Role,
                    attributes: ["name"],
                    as: "role"
                }
            ],
            transaction: transaction
        });
        if (!userRole) {
            throw new AppError('No user role found with the given user ID', StatusCodes.NOT_FOUND);
        }
        return userRole;
    }
}


module.exports = UserRoleRepository; 