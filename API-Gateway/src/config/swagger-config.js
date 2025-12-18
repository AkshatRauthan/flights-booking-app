const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gateway API',
      version: '1.0.0',
      description: 'API documentation for API-Gateway',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/routes/**/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
