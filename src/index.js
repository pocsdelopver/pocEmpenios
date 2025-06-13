const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./commons/swagger')
const cors = require('cors')
const app = express()
const prestamosRoutes = require('./routes')
const MongoConection = require('./commons/mongo.connection')
const log = require('./commons/logger')

// Configuración de CORS
app.use(cors())

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use(express.json())
app.use('/api/v1', prestamosRoutes)

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Prestamos')
})

const PORT = process.env.PORT || 8080

MongoConection.createConnection().then(() => {
  log.info('Conectado a MongoDB...')
  app.listen(PORT, '0.0.0.0', () => {
    log.info(`Servidor corriendo en puerto ${PORT}`)
  })
}).catch(err => {
  log.error(`Error al iniciar app: ${err}`)
  process.exit(1)
})

module.exports = app
