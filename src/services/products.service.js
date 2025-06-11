const ProductModel = require('../models/products.model')

// Crear un producto
async function createProduct(data) {
    const product = new ProductModel(data)
    return await product.save()
}

// Obtener todos los productos
async function getAllProducts() {
    return await ProductModel.find()
}

// Obtener un producto por ID
async function getProductById(id) {
    return await ProductModel.findOne({
        idProducto: id
    })
}

// Actualizar un producto por ID
async function updateProduct(id, data) {
    return await ProductModel.findOneAndUpdate({idProducto: id}, data)
}

// Eliminar un producto por ID
async function deleteProduct(id) {
    return await ProductModel.findOneAndDelete({idProducto: id})
}

const ProductsService = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
module.exports = ProductsService