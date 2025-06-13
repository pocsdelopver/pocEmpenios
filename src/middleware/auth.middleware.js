const TokenService = require('../services/tokens.service')
const log = require('../commons/logger')

const authenticateToken = async (req, res, next) => {
    const { authorization } = req.headers
    log.debug(`Token: ${authorization}`)
    const validateToken = await TokenService.validateToken(authorization)
    if (validateToken && !validateToken.usuario) {
        log.error('Token no valido')
        return res.status(401).json({ message: 'Token no valido' })
    }
     next()
}

const AuthenticateMiddleware = {
    authenticateToken
}
module.exports = AuthenticateMiddleware