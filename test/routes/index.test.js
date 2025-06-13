const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const expect = chai.expect
const express = require('express')
const routes = require('../../src/routes')
const ProductController = require('../../src/controllers/product.controller')
const EmpenioController = require('../../src/controllers/empenio.controller')
const AuthenticateMiddleware = require('../../src/middleware/auth.middleware')
const ProductsService = require('../../src/services/products.service')
const EmpeniosService = require('../../src/services/empenios.service')
const TokenService = require('../../src/services/tokens.service')

chai.use(chaiHttp)

describe('Routes', () => {
    let app
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        app = express()
        app.use(express.json())
        app.use('/api/v1', routes)
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('Product Routes', () => {
        describe('POST /products', () => {
            it('should create a product', async () => {
                const mockProduct = {
                    idProducto: '123',
                    descripcion: 'Test Product',
                    precio: 100
                }
                sandbox.stub(ProductsService, 'createProduct').returns(mockProduct)

                const response = await chai.request(app)
                    .post('/api/v1/products')
                    .send(mockProduct)

                expect(response.status).to.equal(201)
                expect(response.body).to.deep.equal(mockProduct)
            })

            it('should handle validation errors', async () => {
                const mockProduct = {
                    idProducto: '',
                    descripcion: '',
                    precio: 'invalid'
                }
                sandbox.stub(ProductController, 'createProduct').callsFake((req, res) => {
                    res.status(400).json({ error: 'Error en la validación del body' })
                })

                const response = await chai.request(app)
                    .post('/api/v1/products')
                    .send(mockProduct)

                expect(response.status).to.equal(400)
                expect(response.body).to.have.property('error')
            })
        })

        describe('GET /products', () => {
            it('should get all products', async () => {
                const mockProducts = [
                    { idProducto: '123', descripcion: 'Product 1', precio: 100 },
                    { idProducto: '456', descripcion: 'Product 2', precio: 200 }
                ]
                sandbox.stub(ProductsService, 'getAllProducts').returns(mockProducts)

                const response = await chai.request(app)
                    .get('/api/v1/products')

                expect(response.status).to.equal(200)
                expect(response.body).to.deep.equal(mockProducts)
            })
        })

        describe('GET /products/:id', () => {
            it('should get a product by id', async () => {
                const mockProduct = {
                    idProducto: '123',
                    descripcion: 'Test Product',
                    precio: 100
                }
                sandbox.stub(ProductsService, 'getProductById').returns(mockProduct)

                const response = await chai.request(app)
                    .get('/api/v1/products/123')

                expect(response.status).to.equal(200)
                expect(response.body).to.deep.equal(mockProduct)
            })

            it('should return 404 when product not found', async () => {
                sandbox.stub(ProductsService, 'getProductById').returns(null)

                const response = await chai.request(app)
                    .get('/api/v1/products/999')

                expect(response.status).to.equal(404)
                expect(response.body).to.deep.equal({ error: 'Producto no encontrado' })
            })
        })

        describe('PUT /products/:id', () => {
            it('should update a product', async () => {
                const mockProduct = {
                    idProducto: '123',
                    descripcion: 'Updated Product',
                    precio: 150
                }
                sandbox.stub(ProductsService, 'updateProduct').returns(mockProduct)

                const response = await chai.request(app)
                    .put('/api/v1/products/123')
                    .send(mockProduct)

                expect(response.status).to.equal(204)
            })

            it('should return 404 when product to update not found', async () => {
                sandbox.stub(ProductsService, 'updateProduct').returns(null)

                const response = await chai.request(app)
                    .put('/api/v1/products/999')
                    .send({ descripcion: 'Updated Product', precio: 150 })

                expect(response.status).to.equal(404)
                expect(response.body).to.deep.equal({ error: 'Producto no encontrado' })
            })
        })

        describe('DELETE /products/:id', () => {
            it('should delete a product', async () => {
                sandbox.stub(ProductsService, 'deleteProduct').returns({})

                const response = await chai.request(app)
                    .delete('/api/v1/products/123')

                expect(response.status).to.equal(200)
                expect(response.body).to.deep.equal({ message: 'Producto eliminado correctamente' })
            })

            it('should return 404 when product to delete not found', async () => {
                sandbox.stub(ProductsService, 'deleteProduct').returns(null)

                const response = await chai.request(app)
                    .delete('/api/v1/products/999')

                expect(response.status).to.equal(404)
                expect(response.body).to.deep.equal({ error: 'Producto no encontrado' })
            })
        })
    })

    describe('Empenio Routes', () => {
        describe('POST /prestamo', () => {
            it('should calculate empenio when authenticated', async () => {
                const mockEmpenio = {
                    idProducto: '123',
                    gramaje: 100
                }
                sandbox.stub(TokenService, 'validateToken').returns({ usuario: 'test-user' })
                sandbox.stub(EmpeniosService, 'calcularEmpenio').returns({ idProducto: '123', valorEmpenio: 100, message: 'Empeño calculado exitosamente' })

                const response = await chai.request(app)
                    .post('/api/v1/prestamo')
                    .set('authorization', 'valid-token')
                    .send(mockEmpenio)

                expect(response.status).to.equal(200)
            })

            it('should return 401 when not authenticated', async () => {
                sandbox.stub(AuthenticateMiddleware, 'authenticateToken').rejects(new Error('Invalid token'))

                const response = await chai.request(app)
                    .post('/api/v1/prestamo')
                    .set('authorization', 'Bearer invalid-token')
                    .send({
                        idProducto: '123',
                        descripcion: 'Test Product',
                        precio: 100
                    })

                expect(response.status).to.equal(401)
                expect(response.body).to.deep.equal({ message: 'Token no valido' })
            })

            it('should handle validation errors', async () => {
                sandbox.stub(TokenService, 'validateToken').returns({ usuario: 'test-user' })

                const response = await chai.request(app)
                    .post('/api/v1/prestamo')
                    .set('authorization', 'Bearer valid-token')
                    .send({
                        idProducto: '',
                        descripcion: '',
                        precio: 'invalid'
                    })

                expect(response.status).to.equal(400)
                expect(response.body).to.have.property('error')
            })
        })
    })
}) 