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

  test('missing title responds with bad request', async() => {
    const missingTitleBlog = {
      author: 'Kyle Simpson',
      url: 'https://github.com/getify/You-Dont-Know-JS'
    }

    const response = await api.post('/api/blogs')
      .send(missingTitleBlog)
      .expect(400)
    expect(response.body.error).toBeDefined()
  })

  test('missing url responds with bad request', async() => {
    const missingUrlBlog = {
      title: 'You Don\'t Know JS Yet',
      author: 'Kyle Simpson',
    }
    const response = await api.post('/api/blogs')
      .send(missingUrlBlog)
      .expect(400)
    expect(response.body.error).toBeDefined()
  })

})

describe('delete a blog', () => {

  const blogContent = {
    title: 'You Don\'t Know JS Yet',
    author: 'Kyle Simpson',
    likes: 123,
    url: 'https://github.com/getify/You-Dont-Know-JS'
  }

  let savedBlog = null

  beforeEach(async () => {
    const blog = new Blog(blogContent)
   savedBlog = await blog.save().then(b => b.toJSON())
  })

  test('successful status code', async () => {
    let blogBeforeDeleting = await Blog.findById(savedBlog.id)
    expect(blogBeforeDeleting).not.toBeNull()
    expect(blogBeforeDeleting.id).not.toBeNull()

    await api.delete(`/api/blogs/${savedBlog.id}`)
            .expect(204)
    let blogAfterDeleteRequest = await Blog.findById(savedBlog.id)
    expect(blogAfterDeleteRequest).toBeNull()
  })
})

afterAll(() => {
  mongoose.connection.close()
})