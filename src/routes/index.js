const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/product.controller')
const EmpenioController = require('../controllers/empenio.controller')
const authenticateToken = require('../middleware/auth.middleware')

// Crear un producto
router.post('/products', ProductController.createProduct)

// Obtener todos los productos
router.get('/products', ProductController.getAllProducts)

// Obtener un producto por ID
router.get('/products/:id', ProductController.getProductById)

// Actualizar un producto por ID
router.put('/products/:id', ProductController.updateProduct)

// Eliminar un producto por ID
router.delete('/products/:id', ProductController.deleteProduct)

router.post('/prestamo', authenticateToken, EmpenioController.calcularEmpenio)

module.exports = router
