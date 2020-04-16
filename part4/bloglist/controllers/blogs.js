const express = require('express')
const Blog = require('../models/blog')

const router = express.Router()

router.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find()
    response.json(blogs.map(blog => blog.toJSON()))
  } catch (error) {
    next(error)
  }
})

router.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => blog.toJSON())
    .then((blog) => response.json(blog))
    .catch((error) => next(error))
})

router.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = router
