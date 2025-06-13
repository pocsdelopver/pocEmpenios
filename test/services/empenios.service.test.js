const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const EmpeniosService = require('../../src/services/empenios.service');
const ProductsService = require('../../src/services/products.service');
const { PORCENTAJE_PRESTAMO } = require('../../src/commons/constants');
const log = require('../../src/commons/logger');

describe('Empenios Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('calcularEmpenio', () => {
        it('should calculate empenio successfully', async () => {
            const idProducto = '123';
            const gramaje = 10;
            const mockProduct = {
                idProducto: '123',
                nombre: 'Test Product',
                precio: 100
            };
            const expectedValorEmpenio = (mockProduct.precio * gramaje) * PORCENTAJE_PRESTAMO;

            sandbox.stub(ProductsService, 'getProductById').resolves(mockProduct);
            sandbox.stub(log, 'info');
            sandbox.stub(log, 'error');

            const result = await EmpeniosService.calcularEmpenio(idProducto, gramaje);

            expect(result).to.deep.equal({
                idProducto,
                valorEmpenio: expectedValorEmpenio,
                message: 'Empeño calculado exitosamente'
            });
            expect(log.info.calledOnce).to.be.true;
            expect(log.error.called).to.be.false;
        });

        it('should throw error when product not found', async () => {
            const idProducto = '999';
            const gramaje = 10;

            sandbox.stub(ProductsService, 'getProductById').resolves(null);
            sandbox.stub(log, 'info');
            sandbox.stub(log, 'error');

            try {
                await EmpeniosService.calcularEmpenio(idProducto, gramaje);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal(`Producto con ID ${idProducto} no encontrado`);
                expect(log.error.calledOnce).to.be.true;
                expect(log.info.called).to.be.false;
            }
        });

        it('should handle calculation errors', async () => {
            const idProducto = '123';
            const gramaje = 10;
            const mockError = new Error('Calculation error');

            sandbox.stub(ProductsService, 'getProductById').rejects(mockError);
            sandbox.stub(log, 'info');
            sandbox.stub(log, 'error');

            try {
                await EmpeniosService.calcularEmpenio(idProducto, gramaje);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.equal(mockError);
                expect(log.error.calledOnce).to.be.true;
                expect(log.info.called).to.be.false;
            }
        });
    });
}); 