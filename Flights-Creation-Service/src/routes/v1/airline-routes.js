const { AirlineController } = require('../../controllers')
const { AuthMiddleware } = require('../../middlewares');

const express = require('express');
const router = express.Router();

const AirlineAdminRoutes = require('./airline-admin-routes');

// /api/v1/airlines/admin/.........
router.use('/admin',
    AirlineAdminRoutes
);


// /api/v1/airlines/register POST
/**
 * @swagger
 * /api/v1/airlines/register:
 *   post:
 *     summary: Register a new airline
 *     tags: [Airlines]
 *     responses:
 *       201:
 *         description: Airline registered
 */
router.post('/register',
    AirlineController.registerAirlines
);

// /api/v1/airlines/:id  POST
/**
 * @swagger
 * /api/v1/airlines/{id}:
 *   post:
 *     summary: Update an airline
 *     tags: [Airlines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airline updated
 */
router.post('/:id',
    AuthMiddleware.isAirlineAdmin,
    AirlineController.updateAirline
)

// /api/v1/airlines/:id GET
/**
 * @swagger
 * /api/v1/airlines/{id}:
 *   get:
 *     summary: Get airline by ID
 *     tags: [Airlines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airline details
 */
router.get('/:id',
    AirlineController.getAirlineById
);

module.exports = router;