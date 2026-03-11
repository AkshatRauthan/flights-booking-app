const express = require('express');
const { AuthMiddleware } = require('../../middlewares');
const { AirlineAdminController } = require('../../controllers');
const router = express.Router();

// /api/v1/airlines/admin/:airlineId POST
router.post('/:airlineId',
    AuthMiddleware.isAirlineAdmin,
    AuthMiddleware.validateAirlineAdmin,
    AirlineAdminController.registerAirlineAdmin
)


module.exports = router;