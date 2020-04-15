const mongoose = require('mongoose')
const mongoDBURL = process.env.MONGO_DB_URL

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true, unique: true }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

mongoose.connect(mongoDBURL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
    .then(() => {
        console.log("Connected to mongodb")
    }).catch((error) => {
        console.log("Connection to mongodb failed ", error)
    })


module.exports = mongoose.model('Person', personSchema)