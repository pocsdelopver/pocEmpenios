const swaggerJsdoc = require('swagger-jsdoc')

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API con Autenticación',
        version: '1.0.0',
        description: 'Documentación con Authorization header'
      },servers: [
        {
          url: '/api/v1',
          description: 'Servidor de desarrollo'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            name: 'authorization',
            in: 'header'
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js']
  }

const swaggerSpec = swaggerJsdoc(swaggerOptions)

module.exports = swaggerSpec