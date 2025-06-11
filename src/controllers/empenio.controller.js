const EmpeniosService = require('../services/empenios.service')
const log = require('../commons/logger')
const RequestEmpeniosValidator = require('../validator/empenios.validator')

// Calcular empeño
async function calcularEmpenio(req, res) {
    const { idProducto, gramaje } = req.body
    try {
        log.info(`Calculando empeño para el producto ${idProducto} con gramaje ${gramaje}`)
        const resultSaveValidator = RequestEmpeniosValidator.validator.validate(req.body, RequestEmpeniosValidator.requestEmpeniosSchema)
        if (resultSaveValidator.errors.length) {
          log.error(`Error en la validación del body: ${JSON.stringify(resultSaveValidator.errors)}`)
          return res.status(400).json({ error: 'Error en la validación del body', details: resultSaveValidator.errors })
        }
        const resultado = await EmpeniosService.calcularEmpenio(idProducto, gramaje)
        res.json(resultado)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const EmpenioController = {
    calcularEmpenio
}

module.exports = EmpenioController