const express = require("express");
const router = express.Router();

const EmailRoutes = require("./email-router")

router.use('/', EmailRoutes);

module.exports = router;