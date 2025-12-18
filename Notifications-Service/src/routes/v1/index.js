const express = require("express");
const router = express.Router();

const EmailRoutes = require("./email-router")
const swaggerSpec = require("../../config/swagger-config");

router.use('/', EmailRoutes);
router.get('/api-docs/json', (req, res) => {
    res.json(swaggerSpec);
});

module.exports = router;