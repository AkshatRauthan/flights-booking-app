const { UserController } = require('../../controllers');
const { AuthMiddlewares } = require('../../middlewares')

const express = require('express');
const router = express.Router();

// /api/v1/user/signup POST
router.post('/signup',
        AuthMiddlewares.validateAuthRequest,
        UserController.createUser,
);

// /api/v1/user/signin POST
router.post('/signin',
        AuthMiddlewares.validateAuthRequest,
        UserController.authenticateUser,
);

module.exports = router;