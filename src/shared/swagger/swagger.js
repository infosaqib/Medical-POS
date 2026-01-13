// swagger.js - Fixed Configuration
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Health & Fitness API Documentation',
      version: '1.0.0',
      description:
        'API documentation for Health & Fitness tracking application with meal tracking, weight monitoring, and AI assistant features',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      // Add production server when available
      // {
      //   url: "https://your-production-url.com",
      //   description: "Production server"
      // }
    ],
    // AUTHENTICATION CONFIGURATION
    components: {
      securitySchemes: {
        // Bearer Token (JWT) - Primary authentication
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token (obtain from /api/auth/login)',
        },
        // API Key in Header (if you use this)
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'Enter your API key',
        },
      },
      // Common response schemas
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            data: {
              type: 'null',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            errors: {
              type: 'array',
              items: {},
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    // Apply JWT authentication globally to all routes
    // Individual routes can override this with their own security settings
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // IMPORTANT: Fix the file path patterns
  // Use proper wildcards to scan all route files
  apis: [
    './routes/*.route.js', // Scan all .route.js files
    './routes/*.js', // Scan all .js files in routes
    './models/*.js', // Scan model files if you add schemas there
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
