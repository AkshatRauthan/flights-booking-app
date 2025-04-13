const express = require("express");
const rateLimit = require('express-rate-limit'); 

const { ServerConfig, Logger } = require("./config")
const apiRoutes = require("./routes");

const { createProxyMiddleware } = require('http-proxy-middleware');
const { FLIGHTS_SERVICE, BOOKING_SERVICE } = require("./config/server-config");

const app = express();

const limiter = rateLimit({ // Limit Max Requests From an IP to 50 requests per 5 minute.
    window: 5 * 60 * 1000,
    max: 50,
})

app.use('/flightsService', createProxyMiddleware({
    target: FLIGHTS_SERVICE, // target host with the same base path
    changeOrigin: true, // needed for virtual hosted sites
}));

app.use('/bookingsService', createProxyMiddleware({
    target: BOOKING_SERVICE, // target host with the same base path
    changeOrigin: true, // needed for virtual hosted sites
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`\nSuccessfully started the server on port ${ServerConfig.PORT}`);
});

