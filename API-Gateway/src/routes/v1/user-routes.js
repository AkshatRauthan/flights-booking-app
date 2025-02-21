const { UserController } = require('../../controllers');

const express = require('express');
const router = express.Router();

// /api/v1/user/signup POST
router.post('/signup',
        UserController.createUser,
);

module.exports = router;