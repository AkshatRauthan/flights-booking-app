const { UserRepository, RoleRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { AuthFunctions, ENUMS } = require("../utils/common");

const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = ENUMS.USER_ROLES_ENUMS;

const bcrypt = require('bcrypt')

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data) {
    try {
        const user = await userRepository.create(data);
        console.log(data);
        const role =  await roleRepository.getRoleByName(CUSTOMER);
        user.addRole(role);
        return user;
    } catch (error) { 
        if (['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(error.name)) {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new User object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

async function authenticateUser(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError('No user found with the given email', StatusCodes.NOT_FOUND);
        }
        else {
            const passwordMatch = await AuthFunctions.checkPassword(data.password, user.password);
            if (!passwordMatch) {
                throw new AppError('Incorrect password entered', StatusCodes.UNAUTHORIZED);
            }
            else {
                const authToken = await AuthFunctions.createAuthToken({ id: user.id, email: user.email });
                return { authToken };
            }
        } 
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Something Went Wrong', StatusCodes.INTERNAL_SERVER_ERROR);
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

async function testAuthentication(user) {
    try {
        if (!user) throw new AppError(['Someting went wrong after verifing authentication token','User details missing from request'], StatusCodes.INTERNAL_SERVER_ERROR);
        return {
            message: [
                'The authentication token is working properly.',
            ]
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
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
        const adminRole = await roleRepository.getRoleByName(ADMIN);
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
    createUser,
    authenticateUser,
    isAuthenticated,
    testAuthentication,
    addRoleToUser,
    isAdmin,
    getUserEmailById,
    isValidUser,
}