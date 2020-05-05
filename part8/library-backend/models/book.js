const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
    unique: true,
    minlength: 2
  },
  published: {
    type: Number
  },
  genres: [
    { type: String }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
})

module.exports = mongoose.model('Book', schema)