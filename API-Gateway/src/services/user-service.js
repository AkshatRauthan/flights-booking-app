const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { AuthFunctions } = require("../utils/common");

const bcrypt = require('bcrypt')

const userRepository = new UserRepository();

async function createUser(data) {
    try {
        const user = await userRepository.create(data);
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
        if (error instanceof AppError){
            throw error;
        }
        throw new AppError('Something Went Wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createUser,
    authenticateUser,
}