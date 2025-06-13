const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const ProductController = require('../../src/controllers/product.controller');
const ProductsService = require('../../src/services/products.service');
const RequestProductsValidator = require('../../src/validator/product.validator');

describe('Product Controller', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {},
            params: {}
        };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const mockProduct = { id: 1, name: 'Test Product' };
            req.body = { name: 'Test Product' };
            
            sandbox.stub(RequestProductsValidator.validator, 'validate').returns({ errors: [] });
            sandbox.stub(ProductsService, 'createProduct').resolves(mockProduct);

            await ProductController.createProduct(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(mockProduct)).to.be.true;
        });

        it('should return 400 when validation fails', async () => {
            const validationErrors = [{ message: 'Invalid input' }];
            req.body = { name: '' };
            
            sandbox.stub(RequestProductsValidator.validator, 'validate').returns({ errors: validationErrors });

            await ProductController.createProduct(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: 'Error en la validación del body', details: validationErrors })).to.be.true;
        });
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
            sandbox.stub(ProductsService, 'getAllProducts').resolves(mockProducts);

            await ProductController.getAllProducts(req, res);

            expect(res.json.calledWith(mockProducts)).to.be.true;
        });

        it('should handle errors when getting products', async () => {
            const error = new Error('Database error');
            sandbox.stub(ProductsService, 'getAllProducts').rejects(error);

            await ProductController.getAllProducts(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: error.message })).to.be.true;
        });
    });

    describe('getProductById', () => {
        it('should return a product when found', async () => {
            const mockProduct = { id: 1, name: 'Test Product' };
            req.params.id = '1';
            sandbox.stub(ProductsService, 'getProductById').resolves(mockProduct);

            await ProductController.getProductById(req, res);

            expect(res.json.calledWith(mockProduct)).to.be.true;
        });

        it('should return 404 when product not found', async () => {
            req.params.id = '999';
            sandbox.stub(ProductsService, 'getProductById').resolves(null);

            await ProductController.getProductById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ error: 'Producto no encontrado' })).to.be.true;
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            const mockProduct = { id: 1, name: 'Updated Product' };
            req.params.id = '1';
            req.body = { name: 'Updated Product' };
            sandbox.stub(ProductsService, 'updateProduct').resolves(mockProduct);

            await ProductController.updateProduct(req, res);

            expect(res.status.calledWith(204)).to.be.true;
        });

        it('should return 404 when product to update not found', async () => {
            req.params.id = '999';
            req.body = { name: 'Updated Product' };
            sandbox.stub(ProductsService, 'updateProduct').resolves(null);

            await ProductController.updateProduct(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ error: 'Producto no encontrado' })).to.be.true;
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            const mockProduct = { id: 1, name: 'Test Product' };
            req.params.id = '1';
            sandbox.stub(ProductsService, 'deleteProduct').resolves(mockProduct);

            await ProductController.deleteProduct(req, res);

            expect(res.json.calledWith({ message: 'Producto eliminado correctamente' })).to.be.true;
        });

        it('should return 404 when product to delete not found', async () => {
            req.params.id = '999';
            sandbox.stub(ProductsService, 'deleteProduct').resolves(null);

            await ProductController.deleteProduct(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ error: 'Producto no encontrado' })).to.be.true;
        });
    });
}); 