const { UserController } = require('../../controllers');
const { AuthenticationMiddlewares, AuthorizationMiddlewares } = require('../../middlewares');
const validate = require('../../middlewares/validate');
const { updateEmailSchema, updatePasswordSchema, addRoleSchema, idParamSchema } = require('../../middlewares/validators');

const express = require('express');
const router = express.Router();

router.delete('/:id',
    AuthenticationMiddlewares.validateAuthToken,
    AuthorizationMiddlewares.isAccountOwner,
    UserController.deleteUserById,
);

router.post('/:id/email',
    AuthenticationMiddlewares.validateAuthToken,
    AuthorizationMiddlewares.isAccountOwner,
    validate(updateEmailSchema),
    UserController.updateUserEmailById,
);

router.post('/:id/password',
    AuthenticationMiddlewares.validateAuthToken,
    AuthorizationMiddlewares.isAccountOwner,
    validate(updatePasswordSchema),
    UserController.updateUserPasswordById,
);

router.post('/role',
    AuthenticationMiddlewares.validateAuthToken,
    AuthorizationMiddlewares.isAdmin,
    validate(addRoleSchema),
    UserController.addRoleToUser,
);

router.get('/:id/email',
    validate(idParamSchema, 'params'),
    UserController.getUserEmailById,
);

router.post('/validate',
    UserController.isValidUser,
);

module.exports = router;