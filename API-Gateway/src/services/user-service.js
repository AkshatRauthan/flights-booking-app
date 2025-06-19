const { UserRepository, RoleRepository, UserRoleRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { AuthFunctions, ENUMS } = require("../utils/common");
const db = require("../models");

const { SYSTEM_ADMIN, CUSTOMER, AIRLINE_ADMIN } = ENUMS.USER_ROLES_ENUMS;

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const userRoleRepository = new UserRoleRepository();


async function updateUserEmailById(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await userRepository.get(data.userId, transaction);
        if (!user) {
            throw new AppError('No user found with the given id', StatusCodes.NOT_FOUND);
        }
        const updatedUser = await userRepository.updateUserEmailById(data.userId, data.newEmail, transaction);

        // RabbitMQ => acknowledge id
        transaction.commit();
        return updatedUser;
    } catch (error) {
        console.log(error);
        // RabbitMQ => acknowledge and insert again.
        transaction.rollback();
        console.log(error);
        if (error instanceof AppError) throw error;
        throw new AppError("Something went wrong while updating the user email", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateUserPasswordById(data){
    const transaction = await db.sequelize.transaction();
    try {
        const user = await userRepository.get(data.userId, transaction);
        if (!user) {
            throw new AppError('No user found with the given id', StatusCodes.NOT_FOUND);
        }
        const passwordMatch = await AuthFunctions.checkPassword(data.oldPassword, user.password);
        if (!passwordMatch) {
            throw new AppError('Incorrect old password entered', StatusCodes.UNAUTHORIZED);
        }
        const hashedPassword = await AuthFunctions.hashPassword(data.newPassword);
        user.password = hashedPassword;
        const updatedUser = await userRepository.updateUserPasswordById(data.userId, hashedPassword, transaction);

        // RabbitMQ => acknowledge id
        transaction.commit();
        return updatedUser;
    } catch (error) {
        console.log(error);
        // RabbitMQ => acknowledge and insert again.
        transaction.rollback();
        if (error instanceof AppError) throw error;
        throw new AppError("Something went wrong while updating the user password", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteUserById(id) {
    const transaction = await db.sequelize.transaction();
    try {
        const deleteRole = await userRoleRepository.deleteUserRoleByUserId(id, transaction);
        const deleteuser = await userRepository.deleteUserById(id, transaction);

        // RabbitMQ => acknowledge id
        transaction.commit();
        return deleteuser;

    } catch (error) {
        console.log(error);
        // RabbitMQ => acknowledge and insert again.
        transaction.rollback();
        if (error instanceof AppError) throw error;
        throw new AppError("Something went wrong while deleting the user", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token) {
    try {
        if (!token) {
            throw new AppError('Authentication token missing in the request body', StatusCodes.BAD_REQUEST);
        }  
        const response = await AuthFunctions.verifyToken(token);
        const user = await userRepository.get(response.id);
        if (!user) {
            throw new AppError('No user found for the corresponding authentication token', StatusCodes.NOT_FOUND);
        }
        return {
            user : {
                id: user.dataValues.id,
                email: user.dataValues.email,
            }
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name == 'JsonWebTokenError') throw new AppError('Invalid authentication token', StatusCodes.UNAUTHORIZED);
        if (error.name == 'TokenExpiredError') throw new AppError('Authentication token has expired', StatusCodes.UNAUTHORIZED);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoleToUser(data){
    try {
        const user = await userRepository.get(data.userId);
        if (!user) {
            throw new AppError('No user found with the given id', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepository.getRoleByName(data.roleName);
        if (!role) {
            throw new AppError('No role found for the corresponding role name', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(userId){
    try {
        const user = await userRepository.get(userId);
        if (!user){
            throw new AppError('No user found with the given Id', StatusCodes.NOT_FOUND);
        }
        const adminRole = await roleRepository.getRoleByName(SYSTEM_ADMIN);
        if (!adminRole){
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        return user.hasRole(adminRole);
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getUserEmailById(data){
    try {
        const user = await userRepository.get(data.userId);
        if (!user){
            throw new AppError('No user found with the given Id', StatusCodes.NOT_FOUND);
        }
        return {
            email: user.email
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isValidUser(id) {
    const response = await userRepository.get(id, false);
    if (!response || response.length === 0) {
        return false;
    }
    return true;
}

module.exports = {
    isAuthenticated,
    addRoleToUser,
    isAdmin,
    getUserEmailById,
    isValidUser,
    deleteUserById,
    updateUserEmailById,
    updateUserPasswordById,
}