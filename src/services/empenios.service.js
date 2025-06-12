const log = require('../commons/logger')
const ProductsService = require('./products.service')
const { PORCENTAJE_PRESTAMO } = require('../commons/constants')

const calcularEmpenio = async(idProducto, gramaje) => {
    try {
        const Producto = await ProductsService.getProductById(idProducto)
        if (!Producto) {
            throw new Error(`Producto con ID ${idProducto} no encontrado`)
        }
        const valorEmpenio = (Producto.precio * gramaje) * PORCENTAJE_PRESTAMO
        log.info(`Empeño para el producto ${idProducto} y gramaje ${gramaje}: ${valorEmpenio}`)
        return { idProducto, valorEmpenio, message: 'Empeño calculado exitosamente' }
    } catch (error) {
        log.error(`Error al calcular empeño para el producto ${idProducto}: ${error.message}`)
        throw error
    }
}

const EmpeniosService = {
    calcularEmpenio
}

module.exports = EmpeniosService