const express = require('express');
const { AirplaneController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { createAirplaneSchema } = require('../../middlewares/validators');

const router = express.Router();

// /api/v1/airplanes POST
router.post('/',
        validate(createAirplaneSchema),
        AirplaneController.createAirplane
);

// api/v1/airplanes GET
router.get('/',
        AirplaneController.getAirplanes
);

// api/v1/airplanes/:id GET
router.get('/:id',
        AirplaneController.getAirplane
);

// api/v1/airplanes/:id DELETE
router.delete('/:id',
        AirplaneController.destroyAirplane
);

// api/v1/airplanes/:id PATCH
router.patch('/:id',
        validate(createAirplaneSchema),
        AirplaneController.updateAirplane
);

module.exports = router;