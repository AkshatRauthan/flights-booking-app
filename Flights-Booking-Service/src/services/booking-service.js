const axios = require("axios");
const db = require("../models");
const { BookingRepository } = require("../repositories");

async function createBooking(data) {
    try {
        const result = db.sequelize.transaction(async function bookingImpl(t) {
            const flight = axios.get()
        })
    } catch (error) {
        
    }
}