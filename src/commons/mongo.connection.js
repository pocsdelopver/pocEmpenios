/* eslint-disable no-console */
const mongoose = require('mongoose')
const { _ } = require('lodash')
const log = require('./logger')
const { MONGO_CERT_BASE64, MONGO_URL } = require('./constants')

_
const createConnection = async () => {
  log.info('Generando conexión MongoBD...')
  mongoose.set('strictQuery', false)

    const options = {}
    if (MONGO_CERT_BASE64 && MONGO_CERT_BASE64 !== ' ') {
        log.info('Conexión con SSL')
        options.sslCA = [Buffer.from(MONGO_CERT_BASE64, 'base64')]
    }

    const conection = await mongoose.connect(`${MONGO_URL}`, options)

    return conection
}

const MongoConection = {
    createConnection
}

module.exports = MongoConection