const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    minlength: 5,
    required: true
  },
  city: {
    type: String,
    minlength: 3,
    required: true
  },
  friendOf: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

personSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Person', personSchema)