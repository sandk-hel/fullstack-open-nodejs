const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
  let token = null
  const authorizationHeader = request.get('authorization')
  if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
    token = authorizationHeader.substring(7)
  }
  request.token = token
  next()
}

const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.info(error)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }
  return next(error)
}

module.exports = {
  tokenExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
