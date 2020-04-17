const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeAll(async () => {
  await Blog.deleteMany({})

  const initialBlogs = helper.initialBlogs

  for (const blog of initialBlogs) {
    const newBlog = new Blog(blog)
    await newBlog.save()
  }
})

beforeEach(async () => {
  await User.deleteMany({})
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
          author: 'Edsger W. Dijkstra'
        }),
        expect.objectContaining({
          title: 'React patterns',
          author: 'Michael Chan'
        }),
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
    const testUser = await helper.createUserInDb({ username: 'Test User', password: 'sekret', name: 'Test_User' })
    const token = helper.generateToken(testUser)
  
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogContent)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })


  test('blog is not created without token', async () => {  
    const response = await api.post('/api/blogs')
      .send(blogContent)
      .expect(401)

    expect(response.body.error).toBe('invalid token')
  })

  test('blog cannot be created with invalid token', async () => {
    const testUser = await helper.createUserInDb({ username: 'Test User', password: 'sekret', name: 'Test_User' })
    const token = helper.generateToken(testUser)
  
    const response = await api.post('/api/blogs')
      .send(blogContent)
      .set('Authorization', `Bearer 8723kjakjsdjkj`)
      .expect(401)

    expect(response.body.error).toBe('invalid token')
  })

  test('creating blog increases blog in db', async () => {
    const testUser = await helper.createUserInDb({ username: 'Test User', password: 'sekret', name: 'Test_User' })
    const token = helper.generateToken(testUser)
  
    const blogsInDbBefore = await helper.blogsInDb()

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogContent)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsInDbAfter = await helper.blogsInDb()
    expect(blogsInDbBefore.length + 1).toEqual(blogsInDbAfter.length)
  })

  test('creating blog returns the created blog', async () => {
    const testUser = await helper.createUserInDb({ username: 'Test User', password: 'sekret', name: 'Test_User' })
    const token = helper.generateToken(testUser)

    const blog = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogContent)
    expect(blog.body).toEqual(
      expect.objectContaining(blogContent)
    )
  })

  test('missing like is assigned 0 value', async () => {
    const testUser = await helper.createUserInDb({ username: 'Test User', password: 'sekret', name: 'Test_User' })
    const token = helper.generateToken(testUser)

    const blogContentWithoutLike = {
      title: 'You Don\'t Know JS Yet',
      author: 'Kyle Simpson',
      url: 'https://github.com/getify/You-Dont-Know-JS'
    }

    const blog = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogContentWithoutLike)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(blog.body.likes).toBeDefined()
    expect(blog.body.likes).toBe(0)
  })

  test('missing title responds with bad request', async () => {
    const testUser = await helper.createUserInDb({ username: 'Test User', password: 'sekret', name: 'Test_User' })
    const token = helper.generateToken(testUser)

    const missingTitleBlog = {
      author: 'Kyle Simpson',
      url: 'https://github.com/getify/You-Dont-Know-JS'
    }

    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(missingTitleBlog)
      .expect(400)
    expect(response.body.error).toBeDefined()
  })

  test('missing url responds with bad request', async () => {
    const testUser = await helper.createUserInDb({ username: 'Test User', password: 'sekret', name: 'Test_User' })
    const token = helper.generateToken(testUser)

    const missingUrlBlog = {
      title: 'You Don\'t Know JS Yet',
      author: 'Kyle Simpson',
    }
    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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

  test('can be deleted by creator', async () => {
    const testUser = await helper.createUserInDb({ username: 'Test User', password: 'sekret', name: 'Test_User' })
    const token = helper.generateToken(testUser)
    const blog = new Blog(blogContent)
    blog.user = testUser.id
    let savedBlog = await blog.save().then(b => b.toJSON())

    let blogBeforeDeleting = await Blog.findById(savedBlog.id)
    expect(blogBeforeDeleting).not.toBeNull()
    expect(blogBeforeDeleting.id).not.toBeNull()

    await api.delete(`/api/blogs/${savedBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    let blogAfterDeleteRequest = await Blog.findById(savedBlog.id)
    expect(blogAfterDeleteRequest).toBeNull()
  })

  test('cannot be deleted by other user', async () => {
    const testUser1 = await helper.createUserInDb({ username: 'Test User', password: 'sekret', name: 'Test_User' })
    const testUser2 = await helper.createUserInDb({ username: 'Test1 User2', password: 'sekret2', name: 'Test_User2' })

    // Token here is for testUser2
    const token = helper.generateToken(testUser2)

    const blog = new Blog(blogContent)
    // Blog user if testUser not testUser2
    blog.user = testUser1.id
    let savedBlog = await blog.save().then(b => b.toJSON())

    let blogBeforeDeleting = await Blog.findById(savedBlog.id)
    expect(blogBeforeDeleting).not.toBeNull()
    expect(blogBeforeDeleting.id).not.toBeNull()

    const response = await api.delete(`/api/blogs/${savedBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
    expect(response.body.error).toBe('Blog deletion not permitted')
    let blogAfterDeleteRequest = await Blog.findById(savedBlog.id)
    expect(blogAfterDeleteRequest).not.toBeNull()
  })

})

describe('Updating blog', () => {
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

  test('update title', async () => {
    await api.put(`/api/blogs/${savedBlog.id}`)
      .send({ title: 'You will know it' })
      .expect(200)
    const updatedBlog = await Blog.findById(savedBlog.id)
    expect(updatedBlog).not.toBeNull()
    expect(updatedBlog.title).toBe('You will know it')
  })
})

afterAll(() => {
  mongoose.connection.close()
})