const { FlightController } = require('../../controllers');

const { FlightMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();


// /api/v1/flights?trips=MUM-DEL GET
/**
 * @swagger
 * /api/v1/flights:
 *   get:
 *     summary: Get all flights
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: trips
 *         schema:
 *           type: string
 *         description: Filter by trip (e.g., MUM-DEL)
 *     responses:
 *       200:
 *         description: List of flights
 */
router.get('/',
        FlightController.getAllFlights
);

// /api/v1/flights/:id GET
/**
 * @swagger
 * /api/v1/flights/{id}:
 *   get:
 *     summary: Get flight by ID
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flight details
 */
router.get('/:id',
        FlightController.getFlight
)

module.exports = router;