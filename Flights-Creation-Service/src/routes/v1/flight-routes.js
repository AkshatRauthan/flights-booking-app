const { FlightController } = require('../../controllers');

const { FlightMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/flights POST
/**
 * @swagger
 * /api/v1/flights:
 *   post:
 *     summary: Create a new flight
 *     tags: [Flights]
 *     responses:
 *       201:
 *         description: Flight created
 */
router.post('/',
        FlightMiddleware.validateCreateObject,
        FlightController.createFlight
);

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

// /api/v1/flights/:id/seats PATCH
/**
 * @swagger
 * /api/v1/flights/{id}/seats:
 *   patch:
 *     summary: Update flight seats
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Seats updated
 */
router.patch('/:id/seats',
        FlightMiddleware.validateUpdateSeatsRequest,
        FlightController.updateSeats
)

// /api/v1/flights/:id/seats/validate POST
/**
 * @swagger
 * /api/v1/flights/api/v1/flights/{id}/seats/validate:
 *   post:
 *     summary: Validate flight seats
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Seats valid
 */
router.post('/api/v1/flights/:id/seats/validate',
        FlightController.areValidSeats,
)

// /api/v1/flights/validate
/**
 * @swagger
 * /api/v1/flights/validate:
 *   post:
 *     summary: Validate flight
 *     tags: [Flights]
 *     responses:
 *       200:
 *         description: Flight valid
 */
router.post('/validate',
        FlightController.isValidFlight
)


module.exports = router;