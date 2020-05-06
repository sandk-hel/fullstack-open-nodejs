const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 2
  },
  favoriteGenre: {
    type: String
  },
  passwordHash: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', schema)