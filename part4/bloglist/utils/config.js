require('dotenv').config()

const PORT = process.env.PORT
let MONGO_DB_URL = process.env.MONGO_DB_URL

if (process.env.NODE_ENV === 'test') {
  MONGO_DB_URL = process.env.TEST_MONGO_DB_URL
}

module.exports = {
  MONGO_DB_URL,
  PORT,
}
