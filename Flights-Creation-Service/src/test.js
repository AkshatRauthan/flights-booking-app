const { CustomAuthFunctions } = require("./utils/common");
const { encryptServicePayload, decryptServiceToken } = CustomAuthFunctions;

async function testEncryptionDecryption() {

    const payload = {
        userId: 12345,
        role: 'admin',
        permissions: ['read', 'write', 'delete']
    };

    const enc = encryptServicePayload(payload);
    console.log("Encrypted Payload:\n", enc);

    const dec = decryptServiceToken(enc);
    console.log("Decrypted Payload:\n", dec);
}

module.exports = {
    testEncryptionDecryption
};

