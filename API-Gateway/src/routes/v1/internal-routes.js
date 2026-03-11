const express = require('express');
const router = express.Router();

const { AuthController } = require('../../controllers');
const { InternalAuthMiddlewares } = require('../../middlewares');

// POST /api/v1/internal/auth/signup - Internal service-to-service user creation
router.post('/auth/signup',
    InternalAuthMiddlewares.validateInternalAuthRequest,
    InternalAuthMiddlewares.verifyInternalAuthToken,
    InternalAuthMiddlewares.canRegisterUser,
    AuthController.createUser,
);

module.exports = router;
