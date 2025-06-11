const Moment = require ('moment')
const Mongoose = require ('mongoose')
const { COLLECTION_NAME } = require ('../commons/constants')

const productSchema = new Mongoose.Schema(
    {
        idProducto: {
            type: String,
            unique: true
        },
        descripcion: String,
        precio: Number
    },
    {
        timestamps: {
            currentTime: () => Moment(Moment.now(), 'x').toISOString()
        },
        versionKey: false
    }
)

const ProductModel = Mongoose.model(COLLECTION_NAME, productSchema)

module.exports = ProductModel
