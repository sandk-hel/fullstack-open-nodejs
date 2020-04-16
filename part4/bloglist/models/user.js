const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
})

userSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.passwordHash
    delete returnedObject.__v
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
