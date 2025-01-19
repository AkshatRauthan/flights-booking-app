const { AirplaneController } = require('../../controllers');

const { AirplaneMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/airplanes POST
router.post('/',
        AirplaneMiddleware.validateCreateObject,
        AirplaneController.createAirplane
);

// api/v1/airplanes GET
router.get('/',
        AirplaneController.getAirplanes
);

// api/v1/airplanes/:id POST
router.get('/:id',
        AirplaneController.getAirplane
);

// api/v1/airplanes/:id DELETE
router.delete('/:id',
        AirplaneController.destroyAirplane
)

// api/v1/airplanes/:id PATCH
router.patch('/:id',
        AirplaneMiddleware.validateUpdateObject,
        AirplaneController.updateAirplane
)

module.exports = router;