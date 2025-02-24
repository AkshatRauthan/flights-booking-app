const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');    

const { JWT_SECRET, JWT_EXPIRY } = require('../../config/server-config');
const AppError = require('../errors/app-error');
const { StatusCodes } = require('http-status-codes');

async function checkPassword(password, encryptedPassword) {
    try {
        return bcrypt.compareSync(password, encryptedPassword);
    } catch (error) {
        throw error;
    }
}

async function createAuthToken(object) {
    try {
        return jwt.sign(object, JWT_SECRET, {expiresIn: JWT_EXPIRY});
    } catch (error) {
        throw error;
    }
}

async function verifyToken(token) {
    try {
        const response = jwt.verify(token, JWT_SECRET);
        return response;
    } catch (error) {
        if (error.name == 'JsonWebTokenError') throw new AppError('Invalid authentication token', StatusCodes.UNAUTHORIZED);
        if (error.name == 'TokenExpiredError') throw new AppError('Authentication token expired', StatusCodes.UNAUTHORIZED);
        throw new AppError(error.message, error.statusCode);
    }
}

module.exports = {
    checkPassword,
    createAuthToken,
    verifyToken,
}