const { UserController } = require('../../controllers');
const { AuthenticationMiddlewares, AuthorizationMiddlewares } = require('../../middlewares')

const express = require('express');
const router = express.Router();

// /api/v1/user/signup POST
router.post('/signup',
        AuthenticationMiddlewares.validateAuthRequest,
        UserController.createUser,
);

// /api/v1/user/signin POST
router.post('/signin',
        AuthenticationMiddlewares.validateAuthRequest,
        UserController.authenticateUser,
);

// /api/v1/user/test GET
router.get('/test',
        AuthenticationMiddlewares.validateAuthToken,
        UserController.testAuthentication,
);

// /api/v1/user/role POST
router.post('/role',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAdmin,
        UserController.addRoleToUser,
)

// /api/v1/user/:id/email GET
router.get('/:id/email',
        UserController.getUserEmailById,
)

module.exports = router;