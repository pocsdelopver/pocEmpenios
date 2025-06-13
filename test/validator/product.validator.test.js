const chai = require('chai')
const expect = chai.expect
const RequestProductsValidator = require('../../src/validator/product.validator')

describe('Product Validator', () => {
    describe('requestProductsSchema', () => {
        it('should validate a correct product object', () => {
            const validProduct = {
                idProducto: '123',
                descripcion: 'Test Product',
                precio: 100
            }

            const result = RequestProductsValidator.validator.validate(
                validProduct,
                RequestProductsValidator.requestProductsSchema
            )

            expect(result.valid).to.be.true
            expect(result.errors).to.be.empty
        })

        it('should fail validation when idProducto is missing', () => {
            const invalidProduct = {
                descripcion: 'Test Product',
                precio: 100
            }

            const result = RequestProductsValidator.validator.validate(
                invalidProduct,
                RequestProductsValidator.requestProductsSchema
            )

            expect(result.valid).to.be.false
            expect(result.errors).to.not.be.empty
        })

        it('should fail validation when descripcion is missing', () => {
            const invalidProduct = {
                idProducto: '123',
                precio: 100
            }

            const result = RequestProductsValidator.validator.validate(
                invalidProduct,
                RequestProductsValidator.requestProductsSchema
            )

            expect(result.valid).to.be.false
            expect(result.errors).to.not.be.empty
        })

        it('should fail validation when precio is missing', () => {
            const invalidProduct = {
                idProducto: '123',
                descripcion: 'Test Product'
            }

            const result = RequestProductsValidator.validator.validate(
                invalidProduct,
                RequestProductsValidator.requestProductsSchema
            )

            expect(result.valid).to.be.false
            expect(result.errors).to.not.be.empty
        })

        it('should fail validation when precio is not a number', () => {
            const invalidProduct = {
                idProducto: '123',
                descripcion: 'Test Product',
                precio: '100'
            }

            const result = RequestProductsValidator.validator.validate(
                invalidProduct,
                RequestProductsValidator.requestProductsSchema
            )

            expect(result.valid).to.be.false
            expect(result.errors).to.not.be.empty
        })

        it('should fail validation when idProducto is not a string', () => {
            const invalidProduct = {
                idProducto: 123,
                descripcion: 'Test Product',
                precio: 100
            }

            const result = RequestProductsValidator.validator.validate(
                invalidProduct,
                RequestProductsValidator.requestProductsSchema
            )

            expect(result.valid).to.be.false
            expect(result.errors).to.not.be.empty
        })
    })
}) 