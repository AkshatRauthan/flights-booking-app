const { UserController } = require('../../controllers');
const { AuthenticationMiddlewares, AuthorizationMiddlewares, ValidationMiddlewares } = require('../../middlewares');

const express = require('express');
const router = express.Router();

// /api/v1/user/:id DELETE
router.delete('/:id',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAccountOwner,
        UserController.deleteUserById,
);

// /api/v1/user/:id/email POST
router.post('/:id/email',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAccountOwner,
        ValidationMiddlewares.validateUpdateEmail,
        UserController.updateUserEmailById,
);

// /api/v1/user/:id/password POST
router.post('/:id/password',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAccountOwner,
        ValidationMiddlewares.validateUpdatePassword,
        UserController.updateUserPasswordById,
);

// /api/v1/user/role POST
router.post('/role',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAdmin,
        ValidationMiddlewares.validateAddRole,
        UserController.addRoleToUser,
);

// /api/v1/user/:id/email GET
router.get('/:id/email',
        ValidationMiddlewares.validateIdParam,
        UserController.getUserEmailById,
);

// /api/v1/user/validate POST
router.post('/validate',
        UserController.isValidUser
);

module.exports = router;