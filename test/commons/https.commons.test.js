const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
const axios = require('axios')
const HttpCommons = require('../../src/commons/https.commons')
const log = require('../../src/commons/logger')

describe('Http Commons', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        sandbox.stub(log, 'info')
        sandbox.stub(log, 'error')
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('get', () => {
        it('should make a successful GET request', async () => {
            const mockUrl = 'http://test.com'
            const mockConfig = { headers: { 'Authorization': 'Bearer token' } }
            const mockResponse = {
                status: 200,
                data: { message: 'Success' }
            }

            sandbox.stub(axios, 'get').resolves(mockResponse)

            const result = await HttpCommons.get(mockUrl, mockConfig)

            expect(result).to.deep.equal(mockResponse.data)
            expect(axios.get.calledWith(mockUrl, mockConfig)).to.be.true
            expect(log.info.calledOnce).to.be.true
            expect(log.error.called).to.be.false
        })

        it('should handle network errors', async () => {
            const mockUrl = 'http://test.com'
            const mockError = new Error('Network Error')

            sandbox.stub(axios, 'get').rejects(mockError)

            const result = await HttpCommons.get(mockUrl)

            expect(result).to.deep.equal({
                error: true,
                status: 500,
                message: 'No tienes permisos para acceder a este recurso.'
            })
            expect(log.error.calledOnce).to.be.true
            expect(log.info.called).to.be.false
        })

        it('should handle HTTP errors with response', async () => {
            const mockUrl = 'http://test.com'
            const mockError = {
                response: {
                    status: 401,
                    data: {
                        message: 'Unauthorized'
                    }
                }
            }

            sandbox.stub(axios, 'get').rejects(mockError)

            const result = await HttpCommons.get(mockUrl)

            expect(result).to.deep.equal({
                error: true,
                status: 401,
                message: 'Unauthorized'
            })
            expect(log.error.calledOnce).to.be.true
            expect(log.info.called).to.be.false
        })

        it('should handle HTTP errors without response data', async () => {
            const mockUrl = 'http://test.com'
            const mockError = {
                response: {
                    status: 500
                }
            }

            sandbox.stub(axios, 'get').rejects(mockError)

            const result = await HttpCommons.get(mockUrl)

            expect(result).to.deep.equal({
                error: true,
                status: 500,
                message: 'No tienes permisos para acceder a este recurso.'
            })
            expect(log.error.calledOnce).to.be.true
            expect(log.info.called).to.be.false
        })

        it('should handle empty config parameter', async () => {
            const mockUrl = 'http://test.com'
            const mockResponse = {
                status: 200,
                data: { message: 'Success' }
            }

            sandbox.stub(axios, 'get').resolves(mockResponse)

            const result = await HttpCommons.get(mockUrl)

            expect(result).to.deep.equal(mockResponse.data)
            expect(axios.get.calledWith(mockUrl, {})).to.be.true
            expect(log.info.calledOnce).to.be.true
            expect(log.error.called).to.be.false
        })
    })
}) 