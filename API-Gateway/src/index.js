const express = require("express");
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit'); 

const { ServerConfig, Logger, QueueConfig } = require("./config")
const apiRoutes = require("./routes");

const { createProxyMiddleware } = require('http-proxy-middleware');
const { FLIGHT_BOOKING_SERVICE, FLIGHT_CREATION_SERVICE, FLIGHT_SEARCHING_SERVICE } = require("./config/server-config");

const app = express();

const options = { explorer: true,
    swaggerOptions: {
        urls: [
            { url: '/flightsCreationService/api/v1/api-docs/json', name: 'Flights Creation Service' },
            { url: '/flightsSearchingService/api/v1/api-docs/json', name: 'Flights Searching Service' },
            { url: '/flightsBookingsService/api/v1/api-docs/json', name: 'Flights Booking Service' },
            { url: '/api/v1/api-docs/json', name: 'Auth/API-Gateway Service' }
        ]
    }
};

const limiter = rateLimit({ // Limit Max Requests From an IP to 50 requests per 5 minute.
    window: 5 * 60 * 1000,
    max: 50,
})

app.use('/flightsCreationService', createProxyMiddleware({
    target: FLIGHT_CREATION_SERVICE, // target host with the same base path
    changeOrigin: true, // needed for virtual hosted sites
}));

app.use('/flightsSearchingService', createProxyMiddleware({
    target: FLIGHT_SEARCHING_SERVICE, // target host with the same base path
    changeOrigin: true, // needed for virtual hosted sites
}));

app.use('/flightsBookingsService', createProxyMiddleware({
    target: FLIGHT_BOOKING_SERVICE, // target host with the same base path
    changeOrigin: true, // needed for virtual hosted sites
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use('/api', apiRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(null, options));

app.listen(ServerConfig.PORT, async () => {
    console.log(`\nSuccessfully started the server on port ${ServerConfig.PORT}`);
});

