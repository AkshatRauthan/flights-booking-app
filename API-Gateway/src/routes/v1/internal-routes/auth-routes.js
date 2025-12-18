const { AuthController } = require('../../../controllers');
const { InternalAuthMidddlewares, AuthenticationMiddlewares } = require('../../../middlewares')

const express = require('express');
const router = express.Router();

// /api/v1/internal/auth/signup POST

/**
 * @swagger
 * /api/v1/internal/auth/signup:
 *   post:
 *     summary: Internal signup
 *     tags: [Internal Auth]
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post(
    '/signup',
    InternalAuthMidddlewares.validateInternalAuthRequest,
    InternalAuthMidddlewares.verifyInternalAuthToken,
    InternalAuthMidddlewares.canRegisterUser,
    AuthenticationMiddlewares.validateAuthRequest,
    AuthController.createUser
)

module.exports = router;