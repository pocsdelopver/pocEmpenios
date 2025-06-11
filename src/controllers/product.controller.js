const ProductsService = require('../services/products.service')
const RequestProductsValidator = require('../validator/product.validator')

// Crear un producto
async function createProduct(req, res) {
    try {
        // Validar el cuerpo de la solicitud
        const resultSaveValidator = RequestProductsValidator.validator.validate(req.body, RequestProductsValidator.requestProductsSchema)
        if (resultSaveValidator.errors.length) {
            return res.status(400).json({ error: 'Error en la validación del body', details: resultSaveValidator.errors })
        }
        const product = await ProductsService.createProduct(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Obtener todos los productos
async function getAllProducts(req, res) {
    try {
        const products = await ProductsService.getAllProducts()
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Obtener un producto por ID
async function getProductById(req, res) {
    try {
        const product = await ProductsService.getProductById(req.params.id)
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Actualizar un producto por ID
async function updateProduct(req, res) {
    try {
        const product = await ProductsService.updateProduct(req.params.id, req.body)
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.status(204).json()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Eliminar un producto por ID
async function deleteProduct(req, res) {
    try {
        const product = await ProductsService.deleteProduct(req.params.id)
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json({ message: 'Producto eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const ProductController = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}

module.exports = ProductController