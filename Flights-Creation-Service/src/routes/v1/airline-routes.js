const express = require('express');
const { AirlineController } = require('../../controllers');
const { AuthMiddleware } = require('../../middlewares');
const validate = require('../../middlewares/validate');
const { registerAirlineSchema } = require('../../middlewares/validators');

const router = express.Router();

const AirlineAdminRoutes = require('./airline-admin-routes');

// /api/v1/airlines/admin/.........
router.use('/admin',
    AirlineAdminRoutes
);

// /api/v1/airlines POST
router.post('/',
    validate(registerAirlineSchema),
    AirlineController.registerAirlines
);

// /api/v1/airlines/:id  POST
router.post('/:id',
    AuthMiddleware.isAirlineAdmin,
    AirlineController.updateAirline
);

// /api/v1/airlines/:id GET
router.get('/:id',
    AirlineController.getAirlineById
);

module.exports = router;