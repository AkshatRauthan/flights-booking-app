const { UserController } = require('../../controllers');
const { AuthenticationMiddlewares, AuthorizationMiddlewares } = require('../../middlewares')

const express = require('express');
const router = express.Router();

// /api/v1/user/:id DELETE
/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAccountOwner,
        UserController.deleteUserById,
);

// /api/v1/user/:id/email POST
/**
 * @swagger
 * /api/v1/user/{id}/email:
 *   post:
 *     summary: Update user email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated successfully
 */
router.post('/:id/email',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAccountOwner,
        UserController.updateUserEmailById,
);

// /api/v1/user/:id/password POST
/**
 * @swagger
 * /api/v1/user/{id}/password:
 *   post:
 *     summary: Update user password
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.post('/:id/password',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAccountOwner,
        UserController.updateUserPasswordById,
);

// /api/v1/user/role POST
/**
 * @swagger
 * /api/v1/user/role:
 *   post:
 *     summary: Add a role to a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Role added successfully
 */
router.post('/role',
        AuthenticationMiddlewares.validateAuthToken,
        AuthorizationMiddlewares.isAdmin,
        UserController.addRoleToUser,
);

// /api/v1/user/:id/email GET
/**
 * @swagger
 * /api/v1/user/{id}/email:
 *   get:
 *     summary: Get user email by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User email retrieved successfully
 */
router.get('/:id/email',
        UserController.getUserEmailById,
);

// /api/v1/user/validate POST
/**
 * @swagger
 * /api/v1/user/validate:
 *   post:
 *     summary: Validate user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User is valid
 */
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