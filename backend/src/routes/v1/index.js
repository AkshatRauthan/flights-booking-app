const express = require("express");

const router = express.Router();

const { InfoController } = require('../../controllers');

const AirplaneRoutes = require('./airplane-routes');

router.use('/airplanes', AirplaneRoutes);

router.get('/info', InfoController.info);

module.exports = router;