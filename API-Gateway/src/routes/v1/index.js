const express = require("express");
const router = express.Router();

const userRoutes = require("./user-routes");
const authRoutes = require("./auth-routes");
const internalRouter = require("./internal-routes");
const swaggerSpec = require("../../config/swagger-config");

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/internal', internalRouter);

router.get('/api-docs/json', (req, res) => {
    res.json(swaggerSpec);
});
module.exports = router;