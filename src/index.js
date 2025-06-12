const express = require('express');
const app = express();
const prestamosRoutes = require('./routes');
const MongoConection = require('./commons/mongo.connection')
const log = require('./commons/logger')

app.use(express.json());
app.use('/api/v1', prestamosRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Prestamos');
}
);

const PORT = process.env.PORT || 8080;

MongoConection.createConnection().then(() => {
  log.info('Conetado a MongoBD...')
  app.listen(PORT, '0.0.0.0', () => {
  log.info(`Servidor corriendo en puerto ${PORT}`);
})
}).catch(err => log.info(`Error al iniciar app: ${err}`))
