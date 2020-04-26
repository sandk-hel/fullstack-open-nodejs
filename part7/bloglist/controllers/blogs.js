const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')

const router = express.Router()
const jwt = require('jsonwebtoken')


router.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find().populate('user', {username: 1, name: 1})
    response.json(blogs.map(blog => blog.toJSON()))
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== user._id.toString()) {
      return response
        .status(403)
        .send({ error: 'Blog deletion not permitted' })
    }

    await blog.remove()
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (request, response, next) => {
  try {
    const updatedObject = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
      .populate('user', {username: 1, name: 1})
    response.json(updatedObject.toJSON())
  } catch (exception) {
    console.log('Exception ', exception)
    next(exception)
  }
})

router.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => blog.toJSON())
    .then((blog) => response.json(blog))
    .catch((error) => next(error))
})

router.post('/', async (request, response, next) => {
  const title = request.body.title
  const author = request.body.author
  const url = request.body.url
  const likes = request.body.likes || 0

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({ title, author, url, likes })
    blog.user = user._id
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = router
