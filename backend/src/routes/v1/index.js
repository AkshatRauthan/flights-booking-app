const express = require("express");

const router = express.Router();

const { InfoController } = require('../../controllers');

const AirplaneRoutes = require('./airplane-routes');
const AirportRoutes = require('./airport-routes');
const FlightRoutes = require('./flight-routes');
const CityRoutes = require('./city-routes');

router.use('/airplanes', AirplaneRoutes);
router.use('/airports', AirportRoutes);
router.use('/flights', FlightRoutes);
router.use('/cities', CityRoutes);


router.get('/info', InfoController.info);

module.exports = router;