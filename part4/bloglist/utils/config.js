require('dotenv').config()

const { MONGO_DB_URL, PORT } = process.env

module.exports = {
  MONGO_DB_URL,
  PORT,
}
