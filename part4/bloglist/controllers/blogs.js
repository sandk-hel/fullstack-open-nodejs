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

router.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (request, response, next) => {
  try {
    const updatedObject = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.json(updatedObject)
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
    const blog = new Blog({ title, author, url, likes })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = router
