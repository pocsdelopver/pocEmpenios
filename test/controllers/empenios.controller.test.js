const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const EmpenioController = require('../../src/controllers/empenio.controller');
const EmpeniosService = require('../../src/services/empenios.service');
const RequestEmpeniosValidator = require('../../src/validator/empenios.validator');

describe('Empenio Controller', () => {
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

    describe('calcularEmpenio', () => {
        it('should calculate empenio when input is valid', async () => {
            const mockResult = { valor: 1000, moneda: 'MXN' };
            req.body = { idProducto: '123', gramaje: 10 };
            
            sandbox.stub(RequestEmpeniosValidator.validator, 'validate').returns({ errors: [] });
            sandbox.stub(EmpeniosService, 'calcularEmpenio').resolves(mockResult);

            await EmpenioController.calcularEmpenio(req, res);

            expect(res.json.calledWith(mockResult)).to.be.true;
        });

        it('should return 400 when validation fails', async () => {
            const validationErrors = [{ message: 'Invalid input' }];
            req.body = { idProducto: '', gramaje: -1 };
            
            sandbox.stub(RequestEmpeniosValidator.validator, 'validate').returns({ errors: validationErrors });

            await EmpenioController.calcularEmpenio(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: 'Error en la validación del body', details: validationErrors })).to.be.true;
        });

        it('should handle errors when calculating empenio', async () => {
            const error = new Error('Calculation error');
            req.body = { idProducto: '123', gramaje: 10 };
            
            sandbox.stub(RequestEmpeniosValidator.validator, 'validate').returns({ errors: [] });
            sandbox.stub(EmpeniosService, 'calcularEmpenio').rejects(error);

            await EmpenioController.calcularEmpenio(req, res);

            expect(res.json.calledWith({ error: error.message })).to.be.true;
        });
    });
}); 