const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: "React patterns", 
    author: "Michael Chan", 
    url: "https://reactpatterns.com/", 
    likes: 7
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createUserInDb = async ({ username, password, name }) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, name, passwordHash })
  const savedUser = await user.save()
  return savedUser.toJSON()
}

const generateToken = (user) => {
  const signingPayload = {
    id: user.id,
    username: user.username
  }

  return jwt.sign(signingPayload, process.env.SECRET)
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  createUserInDb,
  generateToken
}
