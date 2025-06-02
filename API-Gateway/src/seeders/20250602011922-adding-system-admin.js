"use strict";
const bcrypt = require("bcrypt");
const ServerConfig = require("../config");

require("dotenv").config({ path: __dirname + "/../../.env" });

const SYSTEM_ADMIN_EMAIL = process.env.SYSTEM_ADMIN_EMAIL;
const SYSTEM_ADMIN_PASSWORD = process.env.SYSTEM_ADMIN_PASSWORD;
const SALT_ROUNDS = process.env.SALT_ROUNDS;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const timestamp = new Date();
        const encryptedPassword = bcrypt.hashSync(SYSTEM_ADMIN_PASSWORD, Number(SALT_ROUNDS));

        await queryInterface.bulkInsert("users", [
            {
                id: 1,
                email: SYSTEM_ADMIN_EMAIL,
                password: encryptedPassword,
                createdAt: timestamp,
                updatedAt: timestamp,
            }
        ]);

        await queryInterface.bulkInsert("user_roles", [
            {
                id: 1,
                userId: 1,
                roleId: 1,
                createdAt: timestamp,
                updatedAt: timestamp,
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("user_roles", {
            id : [1]
        });

        await queryInterface.bulkDelete("users", {
            id: [1],
        });
    }
};
