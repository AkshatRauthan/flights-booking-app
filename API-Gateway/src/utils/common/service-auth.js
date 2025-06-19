const crypto = require('crypto');
const AppError = require('../errors/app-error');
const { StatusCodes } = require('http-status-codes');

const ALGORITHM = 'aes-256-gcm';
const { SERVICE_ENCRYPTION_KEY, SERVICE_TOKEN_EXPIRY_IN_SECONDS, SERVICE_NAME } = require("../../config/server-config");
const KEY = Buffer.from(SERVICE_ENCRYPTION_KEY, 'hex');  // 32 bytes = 256 bits key
const IV_LENGTH = 12;  // recommended for GCM

function encryptServicePayload(payload) {
    const now = Math.floor(Date.now());
    payload = {
        ...payload,
        iat: now,
        exp: now + Number(SERVICE_TOKEN_EXPIRY_IN_SECONDS)
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(JSON.stringify(payload), 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const authTag = cipher.getAuthTag();

    const combined = Buffer.concat([iv, authTag, encrypted]); // Combine iv, authTag, and encrypted data into one buffer
    return combined.toString('base64'); // Return base64 encoded string (safe for headers)
}


function decryptServiceToken(token) {
    try {
        const combined = Buffer.from(token, 'base64');

        const iv = combined.slice(0, IV_LENGTH);
        const authTag = combined.slice(IV_LENGTH, IV_LENGTH + 16);
        const encrypted = combined.slice(IV_LENGTH + 16);
        console.log("iv :\n", iv);
        console.log("authTag :\n", authTag);
        console.log("encrypted :\n", encrypted);

        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, null, 'utf8');
        decrypted += decipher.final('utf8');

        const decToken =  JSON.parse(decrypted);
        console.log("Decrypted Token: \n", decToken);
        return decToken;
    } catch (err) {
        console.log(err);
        throw new Error('Invalid or tampered service token');
    }
}

async function generateServiceToken() {
    const payload = {
        sub: SERVICE_NAME,
        permission: ['register-airline-admin'],
    };

    let finalToken = encryptServicePayload(payload);
    console.log(finalToken);
    return finalToken;
}

module.exports = {
    generateServiceToken,
    decryptServiceToken,
};
