const { CityController } = require('../../controllers');

const { CityMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/city POST
/**
 * @swagger
 * /api/v1/city:
 *   post:
 *     summary: Create a new city
 *     tags: [Cities]
 *     responses:
 *       201:
 *         description: City created
 */
router.post('/',
        CityMiddleware.validateCreateObject,
        CityController.createCity
);

// api/v1/city GET
/**
 * @swagger
 * /api/v1/city:
 *   get:
 *     summary: Get all cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: List of cities
 */
router.get('/',
        CityController.getCities
);

// api/v1/city/:id GET
/**
 * @swagger
 * /api/v1/city/{id}:
 *   get:
 *     summary: Get city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: City details
 */
router.get('/:id',
        CityController.getCity
);

// api/v1/city/:id DELETE
/**
 * @swagger
 * /api/v1/city/{id}:
 *   delete:
 *     summary: Delete a city
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: City deleted
 */
router.delete('/:id',
        CityController.destroyCity
)

// api/v1/city/:id PATCH
/**
 * @swagger
 * /api/v1/city/{id}:
 *   patch:
 *     summary: Update a city
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: City updated
 */
router.patch('/:id',
        CityMiddleware.validateUpdateObject,
        CityController.updateCity
)

module.exports = router;