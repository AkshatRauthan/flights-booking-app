const express = require("express");
const router = express.Router();

const userRoutes = require("./user-routes");
const authRoutes = require("./auth-routes");
const internalRouter = require("./internal-routes");

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/internal', internalRouter);

module.exports = router;