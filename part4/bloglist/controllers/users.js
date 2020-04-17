const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response, next) => {
  const username = request.body.username
  const name = request.body.name
  const password = request.body.password

  if (password === undefined) {
    return response.status(400).send({ error: 'Password must not be empty' })
  }
  
  if (password.length < 3) {
    return response.status(400).send({ error: 'Password must be at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  
  try {
    const user = new User({ username, name, passwordHash })
    const savedUser = await user.save()
    response.status(201).json(savedUser.toJSON())
  } catch (exception) {
    next(exception)
  }
})

userRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1})
    response.json(users.map(user => user.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

module.exports = userRouter