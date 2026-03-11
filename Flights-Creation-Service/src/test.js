const { CustomAuthFunctions } = require("./utils/common");
const { encryptServicePayload, decryptServiceToken } = CustomAuthFunctions;
const { Logger } = require('./config');

async function testEncryptionDecryption() {

    const payload = {
        userId: 12345,
        role: 'admin',
        permissions: ['read', 'write', 'delete']
    };

    const enc = encryptServicePayload(payload);
    Logger.info(`Encrypted Payload: ${enc}`);

    const dec = decryptServiceToken(enc);
    Logger.info(`Decrypted Payload: ${JSON.stringify(dec)}`);
}

module.exports = {
    testEncryptionDecryption
};

