const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const expect = chai.expect;
const express = require('express');
const routes = require('../../src/routes');
const ProductController = require('../../src/controllers/product.controller');
const EmpenioController = require('../../src/controllers/empenio.controller');
const authenticateToken = require('../../src/middleware/auth.middleware');

chai.use(chaiHttp);

describe('Routes', () => {
    let sandbox;
    let app = require('../../src/index')

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Product Routes', () => {
        describe('POST /products', () => {
            it('should create a product', async () => {
                const mockProduct = { id: 1, name: 'Test Product' };
                sandbox.stub(ProductController, 'createProduct').callsFake((req, res) => {
                    res.status(201).json(mockProduct);
                });

                const response = await chai.request(app)
                    .post('/products')
                    .send({ name: 'Test Product' });

                expect(response.status).to.equal(201);
                expect(response.body).to.deep.equal(mockProduct);
            });

            it('should handle validation errors', async () => {
                const mockProduct = { name: '' };
                sandbox.stub(ProductController, 'createProduct').callsFake((req, res) => {
                    res.status(400).json({ error: 'Error en la validación del body' });
                });

                const response = await chai.request(app)
                    .post('/products')
                    .send(mockProduct);

                expect(response.status).to.equal(400);
                expect(response.body).to.have.property('error');
            });
        });

        describe('GET /products', () => {
            it('should get all products', async () => {
                const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
                sandbox.stub(ProductController, 'getAllProducts').callsFake((req, res) => {
                    res.json(mockProducts);
                });

                const response = await chai.request(app)
                    .get('/products');

                expect(response.status).to.equal(200);
                expect(response.body).to.deep.equal(mockProducts);
            });
        });

        describe('GET /products/:id', () => {
            it('should get a product by id', async () => {
                const mockProduct = { id: 1, name: 'Test Product' };
                sandbox.stub(ProductController, 'getProductById').callsFake((req, res) => {
                    res.json(mockProduct);
                });

                const response = await chai.request(app)
                    .get('/products/1');

                expect(response.status).to.equal(200);
                expect(response.body).to.deep.equal(mockProduct);
            });

            it('should return 404 when product not found', async () => {
                sandbox.stub(ProductController, 'getProductById').callsFake((req, res) => {
                    res.status(404).json({ error: 'Producto no encontrado' });
                });

                const response = await chai.request(app)
                    .get('/products/999');

                expect(response.status).to.equal(404);
                expect(response.body).to.deep.equal({ error: 'Producto no encontrado' });
            });
        });

        describe('PUT /products/:id', () => {
            it('should update a product', async () => {
                const mockProduct = { id: 1, name: 'Updated Product' };
                sandbox.stub(ProductController, 'updateProduct').callsFake((req, res) => {
                    res.status(204).json();
                });

                const response = await chai.request(app)
                    .put('/products/1')
                    .send({ name: 'Updated Product' });

                expect(response.status).to.equal(204);
            });

            it('should return 404 when product to update not found', async () => {
                sandbox.stub(ProductController, 'updateProduct').callsFake((req, res) => {
                    res.status(404).json({ error: 'Producto no encontrado' });
                });

                const response = await chai.request(app)
                    .put('/products/999')
                    .send({ name: 'Updated Product' });

                expect(response.status).to.equal(404);
                expect(response.body).to.deep.equal({ error: 'Producto no encontrado' });
            });
        });

        describe('DELETE /products/:id', () => {
            it('should delete a product', async () => {
                sandbox.stub(ProductController, 'deleteProduct').callsFake((req, res) => {
                    res.json({ message: 'Producto eliminado correctamente' });
                });

                const response = await chai.request(app)
                    .delete('/products/1');

                expect(response.status).to.equal(200);
                expect(response.body).to.deep.equal({ message: 'Producto eliminado correctamente' });
            });

            it('should return 404 when product to delete not found', async () => {
                sandbox.stub(ProductController, 'deleteProduct').callsFake((req, res) => {
                    res.status(404).json({ error: 'Producto no encontrado' });
                });

                const response = await chai.request(app)
                    .delete('/products/999');

                expect(response.status).to.equal(404);
                expect(response.body).to.deep.equal({ error: 'Producto no encontrado' });
            });
        });
    });

    describe('Empenio Routes', () => {
        describe('POST /prestamo', () => {
            it('should calculate empenio when authenticated', async () => {
                const mockResult = { valor: 1000, moneda: 'MXN' };
                sandbox.stub(authenticateToken, 'validateToken').resolves({ usuario: 'test-user' });
                sandbox.stub(EmpenioController, 'calcularEmpenio').callsFake((req, res) => {
                    res.json(mockResult);
                });

                const response = await chai.request(app)
                    .post('/prestamo')
                    .set('authorization', 'Bearer valid-token')
                    .send({ idProducto: '123', gramaje: 10 });

                expect(response.status).to.equal(200);
                expect(response.body).to.deep.equal(mockResult);
            });

            it('should return 401 when not authenticated', async () => {
                sandbox.stub(authenticateToken, 'validateToken').rejects(new Error('Invalid token'));

                const response = await chai.request(app)
                    .post('/prestamo')
                    .set('authorization', 'Bearer invalid-token')
                    .send({ idProducto: '123', gramaje: 10 });

                expect(response.status).to.equal(401);
                expect(response.body).to.deep.equal({ message: 'Token no valido' });
            });

            it('should return 400 when validation fails', async () => {
                const validationErrors = [{ message: 'Invalid input' }];
                sandbox.stub(authenticateToken, 'validateToken').resolves({ usuario: 'test-user' });
                sandbox.stub(EmpenioController, 'calcularEmpenio').callsFake((req, res) => {
                    res.status(400).json({ error: 'Error en la validación del body', details: validationErrors });
                });

                const response = await chai.request(app)
                    .post('/prestamo')
                    .set('authorization', 'Bearer valid-token')
                    .send({ idProducto: '', gramaje: -1 });

                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({ 
                    error: 'Error en la validación del body', 
                    details: validationErrors 
                });
            });
        });
    });
}); 