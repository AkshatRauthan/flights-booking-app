const { AuthController } = require('../../controllers');
const { AuthenticationMiddlewares, AuthorizationMiddlewares } = require('../../middlewares')

const express = require('express');
const router = express.Router();

// /api/v1/user/signup POST
router.post('/signup',
        AuthenticationMiddlewares.validateAuthRequest,
        AuthController.createUser,
);

// /api/v1/user/signin POST
router.post('/signin',
        AuthenticationMiddlewares.validateAuthRequest,
        AuthController.authenticateUser,
);

module.exports = router;