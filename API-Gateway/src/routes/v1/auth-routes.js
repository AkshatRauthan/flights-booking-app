const { AuthController } = require('../../controllers');
const { AuthenticationMiddlewares, AuthorizationMiddlewares } = require('../../middlewares')

const express = require('express');
const router = express.Router();

// /api/v1/user/signup POST
/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/signup',
        AuthenticationMiddlewares.validateAuthRequest,
        AuthController.createUser,
);

// /api/v1/user/signin POST
/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/signin',
        AuthenticationMiddlewares.validateAuthRequest,
        AuthController.authenticateUser,
);

module.exports = router;