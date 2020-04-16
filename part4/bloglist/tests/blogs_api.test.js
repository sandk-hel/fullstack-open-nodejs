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

  test('that the unique identifier property of the blog posts is named id', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(2)
    expect(blogs.body[0].id).toBeDefined()
    expect(blogs.body[1].id).toBeDefined()
  })
})

describe('Create Blog', () => {
  const blogContent = {
    title: 'You Don\'t Know JS Yet',
    author: 'Kyle Simpson',
    likes: 123,
    url: 'https://github.com/getify/You-Dont-Know-JS'
  }

  test("create blog is successful", async () => {
    await api.post('/api/blogs')
          .send(blogContent)
          .expect(201)
          .expect('Content-Type', /application\/json/)
  })

  test('creating blog increases blog in db', async () => {
    const blogsInDbBefore = await helper.blogsInDb()

    await api.post('/api/blogs')
    .send(blogContent)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsInDbAfter = await helper.blogsInDb()
    expect(blogsInDbBefore.length + 1).toEqual(blogsInDbAfter.length)
  })

  test('creating blog returns the created blog', async() => {
    const blog = await api.post('/api/blogs')
      .send(blogContent)
    expect(blog.body).toEqual(
      expect.objectContaining(blogContent)
    )
  })

  test('missing like is assigned 0 value', async() => {
    const blogContentWithoutLike = {
      title: 'You Don\'t Know JS Yet',
      author: 'Kyle Simpson',
      url: 'https://github.com/getify/You-Dont-Know-JS'
    }

    const blog = await api.post('/api/blogs')
      .send(blogContentWithoutLike)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(blog.body.likes).toBeDefined()
    expect(blog.body.likes).toBe(0)
  })
})

afterAll(() => {
  mongoose.connection.close()
})