const express = require("express");

const router = express.Router();

router.use('/bookings', BookingRoutes);

module.exports = router;