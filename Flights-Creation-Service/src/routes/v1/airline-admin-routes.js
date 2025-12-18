const express = require('express');
const { AuthMiddleware } = require('../../middlewares');
const { AirlineAdminController } = require('../../controllers');
const router = express.Router();

// /api/v1/airlines/admin/:airlineId POST
/**
 * @swagger
 * /api/v1/airlines/admin/{airlineId}:
 *   post:
 *     summary: Register an airline admin
 *     tags: [Airline Admin]
 *     parameters:
 *       - in: path
 *         name: airlineId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Airline admin registered
 */
router.post('/:airlineId',
    AuthMiddleware.isAirlineAdmin,
    AuthMiddleware.validateAirlineAdmin,
    AirlineAdminController.registerAirlineAdmin
)


module.exports = router;