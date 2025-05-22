import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Electra Voting API',
      version: '1.0.0',
      description: 'API documentation for Electra Voting Platform',
    },
    servers: [
      { url: 'http://localhost:5000/api' },
    ],
  },
  apis: ['./src/api/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} 