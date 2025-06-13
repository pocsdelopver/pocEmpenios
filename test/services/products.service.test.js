const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const ProductsService = require('../../src/services/products.service');
const ProductModel = require('../../src/models/products.model');

describe('Products Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createProduct', () => {
        it('should create a product successfully', async () => {
            const productData = {
                idProducto: '123',
                nombre: 'Test Product',
                precio: 100
            };
            const mockProduct = { ...productData, _id: 'mockId' };
            
            sandbox.stub(ProductModel.prototype, 'save').resolves(mockProduct);

            const result = await ProductsService.createProduct(productData);

            expect(result).to.deep.equal(mockProduct);
        });
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const mockProducts = [
                { idProducto: '123', nombre: 'Product 1' },
                { idProducto: '456', nombre: 'Product 2' }
            ];
            
            sandbox.stub(ProductModel, 'find').resolves(mockProducts);

            const result = await ProductsService.getAllProducts();

            expect(result).to.deep.equal(mockProducts);
        });
    });

    describe('getProductById', () => {
        it('should return a product when found', async () => {
            const mockProduct = { idProducto: '123', nombre: 'Test Product' };
            
            sandbox.stub(ProductModel, 'findOne').resolves(mockProduct);

            const result = await ProductsService.getProductById('123');

            expect(result).to.deep.equal(mockProduct);
            expect(ProductModel.findOne.calledWith({ idProducto: '123' })).to.be.true;
        });

        it('should return null when product not found', async () => {
            sandbox.stub(ProductModel, 'findOne').resolves(null);

            const result = await ProductsService.getProductById('999');

            expect(result).to.be.null;
        });
    });

    describe('updateProduct', () => {
        it('should update a product successfully', async () => {
            const updateData = { nombre: 'Updated Product' };
            const mockUpdatedProduct = { idProducto: '123', nombre: 'Updated Product' };
            
            sandbox.stub(ProductModel, 'findOneAndUpdate').resolves(mockUpdatedProduct);

            const result = await ProductsService.updateProduct('123', updateData);

            expect(result).to.deep.equal(mockUpdatedProduct);
            expect(ProductModel.findOneAndUpdate.calledWith(
                { idProducto: '123' },
                updateData
            )).to.be.true;
        });

        it('should return null when product to update not found', async () => {
            const updateData = { nombre: 'Updated Product' };
            sandbox.stub(ProductModel, 'findOneAndUpdate').resolves(null);

            const result = await ProductsService.updateProduct('999', updateData);

            expect(result).to.be.null;
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product successfully', async () => {
            const mockDeletedProduct = { idProducto: '123', nombre: 'Test Product' };
            
            sandbox.stub(ProductModel, 'findOneAndDelete').resolves(mockDeletedProduct);

            const result = await ProductsService.deleteProduct('123');

            expect(result).to.deep.equal(mockDeletedProduct);
            expect(ProductModel.findOneAndDelete.calledWith({ idProducto: '123' })).to.be.true;
        });

        it('should return null when product to delete not found', async () => {
            sandbox.stub(ProductModel, 'findOneAndDelete').resolves(null);

            const result = await ProductsService.deleteProduct('999');

            expect(result).to.be.null;
        });
    });
}); 