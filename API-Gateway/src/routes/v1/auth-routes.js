const { AuthController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { signupSchema, signinSchema } = require('../../middlewares/validators');

const express = require('express');
const router = express.Router();

router.post('/signup', validate(signupSchema), AuthController.createUser);
router.post('/signin', validate(signinSchema), AuthController.authenticateUser);

module.exports = router;