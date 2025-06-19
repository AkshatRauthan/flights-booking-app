const { AuthController } = require('../../../controllers');
const { InternalAuthMidddlewares, AuthenticationMiddlewares } = require('../../../middlewares')

const express = require('express');
const router = express.Router();

// /api/v1/internal/auth/signup POST

router.post(
    '/signup',
    InternalAuthMidddlewares.validateInternalAuthRequest,
    InternalAuthMidddlewares.verifyInternalAuthToken,
    InternalAuthMidddlewares.canRegisterUser,
    AuthenticationMiddlewares.validateAuthRequest,
    AuthController.createUser
)

module.exports = router;