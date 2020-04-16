const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
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

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)
mongoose.set('useCreateIndex', true)
module.exports = User
