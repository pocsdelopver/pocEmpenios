const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const AuthenticateMiddleware = require('../../src/middleware/auth.middleware');
const TokenService = require('../../src/services/tokens.service');
const log = require('../../src/commons/logger');

describe('Auth Middleware', () => {
    let req, res, next, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            headers: {
                authorization: 'Bearer mock-token'
            }
        };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub()
        };
        next = sandbox.spy();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call next() when token is valid', async () => {
        const mockValidateResult = { usuario: 'test-user' };
        sandbox.stub(TokenService, 'validateToken').resolves(mockValidateResult);
        sandbox.stub(log, 'debug');
        sandbox.stub(log, 'error');

        await AuthenticateMiddleware.authenticateToken(req, res, next);

        expect(TokenService.validateToken.calledWith('Bearer mock-token')).to.be.true;
        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
        expect(res.json.called).to.be.false;
        expect(log.debug.calledOnce).to.be.true;
        expect(log.error.called).to.be.false;
    });

    it('should return 401 when token is invalid', async () => {
        const mockValidateResult = { usuario: null };
        sandbox.stub(TokenService, 'validateToken').resolves(mockValidateResult);
        sandbox.stub(log, 'debug');
        sandbox.stub(log, 'error');

        await AuthenticateMiddleware.authenticateToken(req, res, next);

        expect(TokenService.validateToken.calledWith('Bearer mock-token')).to.be.true;
        expect(next.called).to.be.false;
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ message: 'Token no valido' })).to.be.true;
        expect(log.debug.calledOnce).to.be.true;
        expect(log.error.calledOnce).to.be.true;
    });

}); 