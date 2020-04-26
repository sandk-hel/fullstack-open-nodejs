const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user =  await User.findOne({ username: body.username })
  const passwordCorrect = user === null 
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({  
      error: 'Invalid username or password'
    })
  }

  const signingPayload = { 
    id: user._id, 
    username: user.username 
  }

  const token = jwt.sign(signingPayload, process.env.SECRET)
  response
    .status(200)
    .json({ username: user.username, token, name: user.name })
})

module.exports = loginRouter