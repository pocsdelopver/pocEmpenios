const HttpCommons = require('../commons/https.commons')
const log = require('../commons/logger')
const { URL_TOKENS } = require('../commons/constants')

const validateToken = async (token) => {
  try {
    const config = {
      headers: {
        'authorization': token
      }
    }
    const response = await HttpCommons.get(URL_TOKENS, config)
    log.info(`Token validado: ${JSON.stringify(response)}`)
    return response
  } catch (error) {
    throw error
  }
}

const TokenService = {
  validateToken
}

module.exports = TokenService
