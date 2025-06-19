const express = require("express");
const { v4 : uuid } = require("uuid");

const router = express.Router();

const { QueueConfig } = require('../../config');
const { createAirlineAdminReq, getAirlineAdminRes } = QueueConfig;

const AirplaneRoutes = require('./airplane-routes');
const AirlineRoutes = require('./airline-routes');
const AirportRoutes = require('./airport-routes');
const FlightRoutes = require('./flight-routes');
const CityRoutes = require('./city-routes');

router.use('/airplanes', AirplaneRoutes);
router.use('/airlines', AirlineRoutes);
router.use('/airports', AirportRoutes);
router.use('/flights', FlightRoutes);
router.use('/cities', CityRoutes);


// Test route for testing the working of queue
router.get('/test', async (req, res) => {
    try {
        const reqId = uuid();
        const email = "akshatrauthan9433@gmail.com";
        const password = "hello password";
        const isAirlineAdmin = true;
        await createAirlineAdminReq({
            reqId: reqId,
            email: email,
            password: password,
            isAirlineAdmin: isAirlineAdmin
        });
        res.status(200).json({ message: "Queue is working!" });
    } catch (error) {
        console.error("Error in test route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;