const { AirplaneController } = require('../../controllers');

const { AirplaneMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/airplanes POST
/**
 * @swagger
 * /api/v1/airplanes:
 *   post:
 *     summary: Create a new airplane
 *     tags: [Airplanes]
 *     responses:
 *       201:
 *         description: Airplane created
 */
router.post('/',
        AirplaneMiddleware.validateCreateObject,
        AirplaneController.createAirplane
);

// api/v1/airplanes GET
/**
 * @swagger
 * /api/v1/airplanes:
 *   get:
 *     summary: Get all airplanes
 *     tags: [Airplanes]
 *     responses:
 *       200:
 *         description: List of airplanes
 */
router.get('/',
        AirplaneController.getAirplanes
);

// api/v1/airplanes/:id POST
/**
 * @swagger
 * /api/v1/airplanes/{id}:
 *   get:
 *     summary: Get airplane by ID
 *     tags: [Airplanes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airplane details
 */
router.get('/:id',
        AirplaneController.getAirplane
);

// api/v1/airplanes/:id DELETE
/**
 * @swagger
 * /api/v1/airplanes/{id}:
 *   delete:
 *     summary: Delete an airplane
 *     tags: [Airplanes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airplane deleted
 */
router.delete('/:id',
        AirplaneController.destroyAirplane
)

// api/v1/airplanes/:id PATCH
/**
 * @swagger
 * /api/v1/airplanes/{id}:
 *   patch:
 *     summary: Update an airplane
 *     tags: [Airplanes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airplane updated
 */
router.patch('/:id',
        AirplaneMiddleware.validateUpdateObject,
        AirplaneController.updateAirplane
)

module.exports = router;