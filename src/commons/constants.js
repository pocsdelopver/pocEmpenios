const { MONGO_CERT_BASE64 } = process.env 
const { MONGO_URL } = process.env
const { COLLECTION_NAME } = process.env
const { PORCENTAJE_PRESTAMO } = process.env
const { URL_TOKENS } = process.env  


module.exports = {
  MONGO_CERT_BASE64,
  MONGO_URL,
  COLLECTION_NAME,
  PORCENTAJE_PRESTAMO,
  URL_TOKENS
}