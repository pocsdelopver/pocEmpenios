const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const EmpenioController = require('../../src/controllers/empenio.controller');
const EmpeniosService = require('../../src/services/empenios.service');
const RequestEmpeniosValidator = require('../../src/validator/empenios.validator');
const log = require('../../src/commons/logger');

describe('Empenio Controller', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {
                idProducto: '123',
                gramaje: 10
            }
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
        it('should calculate empenio successfully', async () => {
            const mockResult = { valor: 1000, moneda: 'MXN' };
            
            sandbox.stub(RequestEmpeniosValidator.validator, 'validate').returns({ errors: [] });
            sandbox.stub(EmpeniosService, 'calcularEmpenio').resolves(mockResult);
            sandbox.stub(log, 'info');
            sandbox.stub(log, 'error');

            await EmpenioController.calcularEmpenio(req, res);

            expect(log.info.calledOnce).to.be.true;
            expect(res.json.calledWith(mockResult)).to.be.true;
        });

        it('should return 400 when validation fails', async () => {
            const validationErrors = [{ message: 'Invalid input' }];
            req.body = { idProducto: '', gramaje: -1 };
            
            sandbox.stub(RequestEmpeniosValidator.validator, 'validate').returns({ errors: validationErrors });
            sandbox.stub(log, 'info');
            sandbox.stub(log, 'error');

            await EmpenioController.calcularEmpenio(req, res);

            expect(log.error.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ 
                error: 'Error en la validación del body', 
                details: validationErrors 
            })).to.be.true;
        });

        it('should handle service errors', async () => {
            const error = new Error('Service error');
            
            sandbox.stub(RequestEmpeniosValidator.validator, 'validate').returns({ errors: [] });
            sandbox.stub(EmpeniosService, 'calcularEmpenio').rejects(error);
            sandbox.stub(log, 'info');
            sandbox.stub(log, 'error');

            await EmpenioController.calcularEmpenio(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: error.message })).to.be.true;
        });
    });
}); 