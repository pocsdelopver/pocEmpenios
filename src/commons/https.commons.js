const axios = require('axios')
const log = require('./logger')

const get = async (url, config = {}) => {
  try {
    const response = await axios.get(url, config)
    log.info(`Respuesta de la solicitud GET: ${response.status} ${JSON.stringify(response.data)}`)
    return response.data
  } catch (error) {
    log.error(`Error en la solicitud GET: ${error.message}`)
    return {
      error: true,
      status: error.response ? error.response.status : 500,
      message: error.response?.data?.message || 'No tienes permisos para acceder a este recurso.'
    }
  }
}

const HttpCommons = {
  get
}

module.exports = HttpCommons
