const { UserController } = require('../../controllers');

const express = require('express');
const router = express.Router();

// /api/v1/user/signup POST
router.post('/signup',
        UserController.createUser,
);

// /api/v1/user/signin POST
router.post('/signin',
        UserController.authenticateUser,
);

module.exports = router;