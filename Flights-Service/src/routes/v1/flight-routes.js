const { FlightController } = require('../../controllers');

const { FlightMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/flights POST
router.post('/',
        FlightMiddleware.validateCreateObject,
        FlightController.createFlight
);

// /api/v1/flights?trips=MUM-DEL GET
router.get('/',
        FlightController.getAllFlights
);

// /api/v1/flights/:id GET
router.get('/:id',
        FlightController.getFlight
)

// /api/v1/flights/seats PATCH
router.patch('/seats/:id',
        FlightMiddleware.validateUpdateSeatsRequest,
        FlightController.updateSeats
)
module.exports = router;