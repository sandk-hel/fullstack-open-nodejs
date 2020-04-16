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

router.post('/', (request, response, next) => {
  const blog = new Blog(request.body)
  blog.save()
    .then((result) => {
      response.status(201).json(result.toJSON())
    })
    .catch((error) => next(error))
})

module.exports = router
