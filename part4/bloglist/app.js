const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsController = require('./controllers/blogs')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()
app.use(middleware.requestLogger)
app.use(express.json())
app.use(cors())

mongoose.connect(config.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info(`Connected to mongo db at ${config.MONGO_DB_URL}`)
  })
  .catch((error) => {
    logger.error('MongoDB not connected error: ', error.message)
  })

app.use('/api/blogs', blogsController)
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
