const { Validator } = require('jsonschema')

const validator = new Validator()

const requestEmpeniosSchema = {
    id: '/requestSchemaEmpenios',
    type: 'object',
    properties: {
        idProducto: {type: 'string', required: true},
        gramaje: {type: 'number', required: true}
    }
}

validator.addSchema(requestEmpeniosSchema, '/requestSchemaEmpenios')

const RequestEmpeniosValidator = {
    validator,
    requestEmpeniosSchema
}

module.exports = RequestEmpeniosValidator