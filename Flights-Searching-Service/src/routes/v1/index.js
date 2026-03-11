const express = require("express");

const router = express.Router();

const FlightRoutes = require('./flight-routes');

router.use('/flights', FlightRoutes);

module.exports = router;