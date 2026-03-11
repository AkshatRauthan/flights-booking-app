const express = require('express');
const { FlightController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { createFlightSchema, updateSeatsSchema } = require('../../middlewares/validators');

const router = express.Router();

// /api/v1/flights POST
router.post('/',
        validate(createFlightSchema),
        FlightController.createFlight
);

// /api/v1/flights?trips=MUM-DEL GET
router.get('/',
        FlightController.getAllFlights
);

// /api/v1/flights/:id GET
router.get('/:id',
        FlightController.getFlight
);

// /api/v1/flights/:id/seats PATCH
router.patch('/:id/seats',
        validate(updateSeatsSchema),
        FlightController.updateSeats
);

// /api/v1/flights/:id/seats/validate POST
router.post('/:id/seats/validate',
        FlightController.areValidSeats
);

// /api/v1/flights/validate
router.post('/validate',
        FlightController.isValidFlight
);

module.exports = router;