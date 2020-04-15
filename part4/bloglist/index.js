/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const http = require('http')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')

const app = express()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(config.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then((blogs) => blogs.map((blog) => blog.toJSON()))
    .then((blogs) => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then((result) => {
      response.status(201).json(result.toJSON())
    })
})

http.createServer(app)
  .listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
