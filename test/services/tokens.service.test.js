const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const TokenService = require('../../src/services/tokens.service');
const HttpCommons = require('../../src/commons/https.commons');
const { URL_TOKENS } = require('../../src/commons/constants');
const log = require('../../src/commons/logger');

describe('Token Service', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('validateToken', () => {
        it('should validate token successfully', async () => {
            const token = 'Bearer mock-token';
            const mockResponse = { usuario: 'test-user' };
            
            sandbox.stub(HttpCommons, 'get').resolves(mockResponse);
            sandbox.stub(log, 'info');

            const result = await TokenService.validateToken(token);

            expect(result).to.deep.equal(mockResponse);
            expect(HttpCommons.get.calledWith(URL_TOKENS, {
                headers: {
                    'authorization': token
                }
            })).to.be.true;
            expect(log.info.calledOnce).to.be.true;
        });

        it('should handle validation error', async () => {
            const token = 'Bearer invalid-token';
            const mockError = new Error('Invalid token');
            
            sandbox.stub(HttpCommons, 'get').rejects(mockError);
            sandbox.stub(log, 'info');

            try {
                await TokenService.validateToken(token);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.equal(mockError);
                expect(HttpCommons.get.calledWith(URL_TOKENS, {
                    headers: {
                        'authorization': token
                    }
                })).to.be.true;
                expect(log.info.called).to.be.false;
            }
        });

        it('should handle network error', async () => {
            const token = 'Bearer mock-token';
            const mockError = new Error('Network error');
            
            sandbox.stub(HttpCommons, 'get').rejects(mockError);
            sandbox.stub(log, 'info');

            try {
                await TokenService.validateToken(token);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.equal(mockError);
                expect(HttpCommons.get.calledWith(URL_TOKENS, {
                    headers: {
                        'authorization': token
                    }
                })).to.be.true;
                expect(log.info.called).to.be.false;
            }
        });

        it('should handle empty token', async () => {
            const token = '';
            const mockError = new Error('Invalid token');
            
            sandbox.stub(HttpCommons, 'get').rejects(mockError);
            sandbox.stub(log, 'info');

            try {
                await TokenService.validateToken(token);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.equal(mockError);
                expect(HttpCommons.get.calledWith(URL_TOKENS, {
                    headers: {
                        'authorization': token
                    }
                })).to.be.true;
                expect(log.info.called).to.be.false;
            }
        });
    });
}); 