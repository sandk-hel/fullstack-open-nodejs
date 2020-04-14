const mongoose = require('mongoose')


if (process.argv.length < 3) {
    console.log('Password must be passed')
    process.exit(1)
}

const password = process.argv[2]
const schema = new mongoose.Schema({
    "name": String,
    "number": String
})


const Person = mongoose.model('Person', schema)
const connectionUrl = `mongodb+srv://fullstack:${password}@cluster0-jrrmj.mongodb.net/PhoneBook?retryWrites=true`

mongoose.connect(connectionUrl,
    { useNewUrlParser: true, 
        useUnifiedTopology: true })

const findAll = () => Person.find()
const store = (name, number) => new Person({ name, number }).save()



if (process.argv.length == 3) {
    findAll()
        .then(persons => 
            persons.map(person => `${person.name} ${person.number}`))
        .then(persons => persons.join("\n"))
        .then((joined) => {
            console.log("phonebook: ")
            console.log(joined)
            mongoose.connection.close()
            process.exit(1)
        })
} else if (process.argv.length >= 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    store(name, number)
        .then(() => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
            process.exit(1)
        })
} else {
    console.log("Unknown command")
    process.exit(1)
}

