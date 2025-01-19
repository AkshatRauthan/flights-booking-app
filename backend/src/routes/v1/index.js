const express = require("express");

const router = express.Router();

const { InfoController } = require('../../controllers');

const AirplaneRoutes = require('./airplane-routes');
const CityRoutes = require('./city-routes');

router.use('/airplanes', AirplaneRoutes);

router.use('/city', CityRoutes);

router.get('/info', InfoController.info);

module.exports = router;