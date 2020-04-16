const supertest = require('supertest')
const mongoose = require('mongoose')

const User = require('../models/user')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeAll(async () => {
  await User.deleteMany({})
})

describe('Creating user', () => {

  test('cannot create with empty username', async () => {
    const userContent = {
      password: 'sekret'
    }
    const response = await api
      .post('/api/users')
      .send(userContent)
      .expect(400)
    expect(response.body.error).toContain('Path `username` is required.')
  })

  test('cannot create with empty password', async () => {
    const userContent = {
      username: 'sandeep'
    }
    const response = await api
      .post('/api/users')
      .send(userContent)
      .expect(400)
    expect(response.body.error).toContain('Password must not be empty')
  })

  test('cannot create with invalid username', async () => {
    const username = 'sa'
    const userContent = {
      password: 'sekret',
      username
    }
    const response = await api
      .post('/api/users')
      .send(userContent)
      .expect(400)
    
    const errorMessage = `Path \`username\` (\`${username}\`) is shorter than the minimum allowed length (3).`
    expect(response.body.error).toContain(errorMessage)
  })

  test('cannot create with invalid password', async () => {
    const userContent = {
      password: 'se',
      username: 'sandeep'
    }
    const response = await api
      .post('/api/users')
      .send(userContent)
      .expect(400)
    
    expect(response.body.error).toContain('Password must be at least 3 characters')
  })
  
  test('create with valid username and password', async () => {
    const usersInDbBefore = await helper.usersInDb()

    const username = 'Sandeep'
    const password = 'Sandeep1'
    const name = 'Sandeep Koirala'
    const response  = await api
      .post('/api/users')
      .send({ username, password })
      .expect(201)

    expect(response.body.id).toBeDefined()
    expect(response.body.username).toBe(username)
    const usersInDbAfter = await helper.usersInDb()

    expect(usersInDbAfter.length).toBe(usersInDbBefore.length + 1)
  })

  test('username must be unique', async () => {
    const username = 'Sandeep1'
    const password = 'Sandeep'

    await helper.createUserInDb({ username, name: 'Sandeep Koirala', password })

    const response = await api
      .post('/api/users')
      .send({ username, password })
      .expect(400)
    
    const validationError = `expected \`username\` to be unique. Value: \`${username}\``
    expect(response.body.error).toContain(validationError)      
  })
}) 

afterAll(async () => {
  mongoose.connection.close()
})
