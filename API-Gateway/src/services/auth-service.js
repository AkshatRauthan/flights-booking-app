const { UserRepository, RoleRepository, UserRoleRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { AuthFunctions, ENUMS } = require("../utils/common");
const db = require("../models");

const { SYSTEM_ADMIN, CUSTOMER, AIRLINE_ADMIN } = ENUMS.USER_ROLES_ENUMS;

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const userRoleRepository = new UserRoleRepository();


async function createUser(data) {
    try {
        const user = await userRepository.create(data);
        console.log(data);
        const role =  await roleRepository.getRoleByName(data.role)
        user.addRole(role); // Role => User can also be An Airline Admin. So in line update logic to get role along with id.
        return user;
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error;
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
    try {  // Mechanism to also add user role
        const user = await userRepository.getUserByEmail(data.email);
        const userRole = await userRoleRepository.getUserRoleByUserId(user.id);
        const rolename = userRole.dataValues.role.dataValues.name;
        if (!user) {
            throw new AppError('No user found with the given email', StatusCodes.NOT_FOUND);
        }
        else {
            const passwordMatch = await AuthFunctions.checkPassword(data.password, user.password);
            if (!passwordMatch) {
                throw new AppError('Incorrect password entered', StatusCodes.UNAUTHORIZED);
            }
            else {
                const authToken = await AuthFunctions.createAuthToken({ id: user.id, email: user.email, role: rolename });
                console.log(authToken);
                return { authToken };
            }
        }
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error;
        throw new AppError('Something Went Wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAirlineAdmin(userId){
    try {
        const user = await userRepository.get(userId);
        if (!user){
            throw new AppError('No user found with the given Id', StatusCodes.NOT_FOUND);
        }
        const adminRole = await roleRepository.getRoleByName(AIRLINE_ADMIN);
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


module.exports = {
    createUser,
    authenticateUser,
    isAirlineAdmin,
}