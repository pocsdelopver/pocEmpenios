const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/product.controller')
const EmpenioController = require('../controllers/empenio.controller')
const AuthenticateMiddleware = require('../middleware/auth.middleware')

/**
 * @swagger
 * components:
 *   schemas:
 *     EmpenioRequest:
 *       type: object
 *       required:
 *         - idProducto
 *         - gramaje
 *       properties:
 *         idProducto:
 *           type: string
 *           description: Identificador único del producto
 *           example: "123"
 *         gramaje:
 *           type: number
 *           format: float
 *           description: Peso en gramos del producto
 *           example: 100.5
 *     EmpenioResponse:
 *       type: object
 *       properties:
 *         idProducto:
 *           type: string
 *           description: Identificador del producto
 *           example: "123"
 *         valorEmpenio:
 *           type: number
 *           format: float
 *           description: Valor calculado del empeño
 *           example: 1000.00
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado
 *           example: "Empeño calculado exitosamente"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *           example: "Error en la validación del body"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Mensaje detallado del error
 *                 example: "idProducto es requerido"
 */

/**
 * @swagger
 * /prestamo:
 *   post:
 *     summary: Calcular el valor de un empeño
 *     description: Calcula el valor del empeño basado en el producto y su gramaje
 *     tags:
 *       - Empeños
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: test
 *         schema:
 *           type: string
 *         required: true
 *         description: Token JWT en formato 'Bearer {token}'
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmpenioRequest'
 *           example:
 *             idProducto: "123"
 *             gramaje: 100.5
 *     responses:
 *       200:
 *         description: Empeño calculado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpenioResponse'
 *             example:
 *               idProducto: "123"
 *               valorEmpenio: 1000.00
 *               message: "Empeño calculado exitosamente"
 *       400:
 *         description: Error en la validación o cálculo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Error en la validación del body"
 *               details:
 *                 - message: "idProducto es requerido"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token no valido"
 *             example:
 *               message: "Token no valido"
 */
router.post('/prestamo', AuthenticateMiddleware.authenticateToken, EmpenioController.calcularEmpenio)

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

module.exports = router
