const chai = require('chai')
const expect = chai.expect
const RequestEmpeniosValidator = require('../../src/validator/empenios.validator')

describe('Empenios Validator', () => {
    describe('requestEmpeniosSchema', () => {
        it('should validate a correct empenio object', () => {
            const validEmpenio = {
                idProducto: '123',
                gramaje: 10
            }

            const result = RequestEmpeniosValidator.validator.validate(
                validEmpenio,
                RequestEmpeniosValidator.requestEmpeniosSchema
            )

            expect(result.valid).to.be.true
            expect(result.errors).to.be.empty
        })

        it('should fail validation when idProducto is missing', () => {
            const invalidEmpenio = {
                gramaje: 10
            }

            const result = RequestEmpeniosValidator.validator.validate(
                invalidEmpenio,
                RequestEmpeniosValidator.requestEmpeniosSchema
            )

            expect(result.valid).to.be.false
            expect(result.errors).to.not.be.empty
        })

        it('should fail validation when gramaje is missing', () => {
            const invalidEmpenio = {
                idProducto: '123'
            }

            const result = RequestEmpeniosValidator.validator.validate(
                invalidEmpenio,
                RequestEmpeniosValidator.requestEmpeniosSchema
            )

            expect(result.valid).to.be.false
            expect(result.errors).to.not.be.empty
        })

        it('should fail validation when gramaje is not a number', () => {
            const invalidEmpenio = {
                idProducto: '123',
                gramaje: '10'
            }

            const result = RequestEmpeniosValidator.validator.validate(
                invalidEmpenio,
                RequestEmpeniosValidator.requestEmpeniosSchema
            )

            expect(result.valid).to.be.false
            expect(result.errors).to.not.be.empty
            expect(result.errors[0].property).to.equal('instance.gramaje')
            expect(result.errors[0].message).to.include('is not of a type(s) number')
        })

        it('should fail validation when idProducto is not a string', () => {
            const invalidEmpenio = {
                idProducto: 123,
                gramaje: 10
            }

            const result = RequestEmpeniosValidator.validator.validate(
                invalidEmpenio,
                RequestEmpeniosValidator.requestEmpeniosSchema
            )

            expect(result.valid).to.be.false
            expect(result.errors).to.not.be.empty
            expect(result.errors[0].property).to.equal('instance.idProducto')
            expect(result.errors[0].message).to.include('is not of a type(s) string')
        })
    })
}) 