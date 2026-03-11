const { UserController } = require('../../controllers');
const { AuthenticationMiddlewares, AuthorizationMiddlewares } = require('../../middlewares')

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
        UserController.updateUserEmailById,
);

// /api/v1/user/:id/password POST
router.post('/:id/password',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAccountOwner,
        UserController.updateUserPasswordById,
);

// /api/v1/user/role POST
router.post('/role',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAdmin,
        UserController.addRoleToUser,
);

// /api/v1/user/:id/email GET
router.get('/:id/email',
        UserController.getUserEmailById,
);

// /api/v1/user/validate POST
router.post('/validate',
        UserController.isValidUser
);

// /api/v1/admin
// router.post(
//         '/admin',
//         AuthenticationMiddlewares.validateAuthToken,
//         AuthorizationMiddlewares.isAdmin,
//         UserController.isAdmin
// )


// /api/v1/user/test GET

const jwt = require('jsonwebtoken');    
const { JWT_SECRET, JWT_EXPIRY } = require('../../config/server-config');

// Working
router.get('/test', (req, res) => {
        const accessToken = req.headers['x-access-token'];
        const decoded = jwt.verify(accessToken, JWT_SECRET);
        console.log(decoded);
        return res.status(200).json({
                message: 'Test route is working',
                user: decoded
        });
})
module.exports = router;



// Route to delete user in case the transaction rollesback from Flights_Creations_Service.