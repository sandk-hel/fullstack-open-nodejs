const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')

beforeAll(async () => {
  await Blog.deleteMany({})

  const initialBlogs = helper.initialBlogs

  for (const blog of initialBlogs) {
    const newBlog = new Blog(blog)
    await newBlog.save()
  }
})

describe('Get all', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(helper.initialBlogs.length)
  })

  test('correct blog is contained in returned json', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ 
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra'}),
        expect.objectContaining({ 
          title: 'React patterns',
          author: 'Michael Chan'}),
      ])
    )
  })
})

afterAll(() => {
  mongoose.connection.close()
})