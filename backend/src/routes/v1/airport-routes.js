const { AirportController } = require('../../controllers');

const { AirportMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/airport POST
router.post('/',
        AirportMiddleware.validateCreateObject,
        AirportController.createAirport
);

// api/v1/airport GET
router.get('/',
        AirportController.getAirports
);

// api/v1/airport/:id POST
router.get('/:id',
        AirportController.getAirport
);

// api/v1/airport/:id DELETE
router.delete('/:id',
        AirportController.destroyAirport
)

module.exports = router;