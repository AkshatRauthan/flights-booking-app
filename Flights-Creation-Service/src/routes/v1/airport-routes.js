const { AirportController } = require('../../controllers');

const { AirportMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/airports POST
/**
 * @swagger
 * /api/v1/airports:
 *   post:
 *     summary: Create a new airport
 *     tags: [Airports]
 *     responses:
 *       201:
 *         description: Airport created
 */
router.post('/',
        AirportMiddleware.validateCreateObject,
        AirportController.createAirport
);

// api/v1/airports GET
/**
 * @swagger
 * /api/v1/airports:
 *   get:
 *     summary: Get all airports
 *     tags: [Airports]
 *     responses:
 *       200:
 *         description: List of airports
 */
router.get('/',
        AirportController.getAirports
);

// api/v1/airports/:id GET
/**
 * @swagger
 * /api/v1/airports/{id}:
 *   get:
 *     summary: Get airport by ID
 *     tags: [Airports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airport details
 */
router.get('/:id',
        AirportController.getAirport
);

// api/v1/airports/:id PATCH
/**
 * @swagger
 * /api/v1/airports/{id}:
 *   patch:
 *     summary: Update an airport
 *     tags: [Airports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airport updated
 */
router.patch('/:id',
        AirportMiddleware.validateUpdateObject,
        AirportController.updateAirport
);

// api/v1/airports/:id DELETE
/**
 * @swagger
 * /api/v1/airports/{id}:
 *   delete:
 *     summary: Delete an airport
 *     tags: [Airports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airport deleted
 */
router.delete('/:id',
        AirportController.destroyAirport
)

module.exports = router;