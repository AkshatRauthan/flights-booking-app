const axios = require("axios");

const { ServerConfig } = require("../../../config")

async function getEmailById(userId){
    try {
        const response = await axios.get(`${ServerConfig.API_GATEWAY}/api/v1/user/${userId}/email`);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    getEmailById,
}