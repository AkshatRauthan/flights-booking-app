const { FlightController } = require('../../controllers');

const { FlightMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/flights POST
router.post('/',
        FlightMiddleware.validateCreateObject,
        FlightController.createFlight
);



module.exports = router;