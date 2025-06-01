const { FlightController } = require('../../controllers');

const { FlightMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/flights POST
router.post('/',
        FlightMiddleware.validateCreateObject,
        FlightController.createFlight
);

// /api/v1/flights/:id/seats PATCH
router.patch('/:id/seats',
        FlightMiddleware.validateUpdateSeatsRequest,
        FlightController.updateSeats
)

// /api/v1/flights/:id/seats/validate POST
router.post('/api/v1/flights/:id/seats/validate',
        FlightController.areValidSeats,
)

// /api/v1/flights/validate
router.post('/validate',
        FlightController.isValidFlight
)


module.exports = router;