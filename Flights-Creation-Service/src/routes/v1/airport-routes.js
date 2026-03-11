const express = require('express');
const { AirportController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { createAirportSchema } = require('../../middlewares/validators');

const router = express.Router();

// /api/v1/airports POST
router.post('/',
        validate(createAirportSchema),
        AirportController.createAirport
);

// api/v1/airports GET
router.get('/',
        AirportController.getAirports
);

// api/v1/airports/:id GET
router.get('/:id',
        AirportController.getAirport
);

// api/v1/airports/:id PATCH
router.patch('/:id',
        validate(createAirportSchema),
        AirportController.updateAirport
);

// api/v1/airports/:id DELETE
router.delete('/:id',
        AirportController.destroyAirport
);

module.exports = router;