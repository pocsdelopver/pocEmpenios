const { Validator } = require('jsonschema')

const validator = new Validator()

const requestProductsSchema = {
    id: '/requestSchemaProducts',
    type: 'object',
    properties: {
        idProducto: {type: 'string', required: true},
        descripcion: {type: 'string', required: true},
        precio: {type: 'number', required: true}
    }
}

validator.addSchema(requestProductsSchema, '/requestSchemaProducts')

const RequestProductsValidator = {
    validator,
    requestProductsSchema
}

module.exports = RequestProductsValidator