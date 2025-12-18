const express = require("express");

const router = express.Router();

const FlightRoutes = require('./flight-routes');
const swaggerSpec = require("../../config/swagger-config");

router.use('/flights', FlightRoutes);
router.get('/api-docs/json', (req, res) => {
    res.json(swaggerSpec);
});

module.exports = router;