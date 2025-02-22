const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');    

const { JWT_SECRET, JWT_EXPIRY } = require('../../config/server-config');

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

module.exports = {
    checkPassword,
    createAuthToken,
}