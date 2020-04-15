const express = require('express')
const Blog = require('../models/blog')

const router = express.Router()

router.get('/', (request, response, next) => {
  Blog.find()
    .then((blogs) => blogs.map((blog) => blog.toJSON()))
    .then((blogs) => {
      response.json(blogs)
    })
    .catch((error) => next(error))
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
