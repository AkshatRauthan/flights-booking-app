const { FlightController } = require('../../controllers');

const { FlightMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();


// /api/v1/flights?trips=MUM-DEL GET
router.get('/',
        FlightController.getAllFlights
);

// /api/v1/flights/:id GET
router.get('/:id',
        FlightController.getFlight
)

module.exports = router;