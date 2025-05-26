const express = require("express");

const router = express.Router();

const AirplaneRoutes = require('./airplane-routes');
const AirportRoutes = require('./airport-routes');
const FlightRoutes = require('./flight-routes');
const CityRoutes = require('./city-routes');

router.use('/airplanes', AirplaneRoutes);
router.use('/airports', AirportRoutes);
router.use('/flights', FlightRoutes);
router.use('/cities', CityRoutes);

module.exports = router;