require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))

const hasJSONBody = (req, _) => {
    return req.method === "POST" || req.method === "PUT"
}

morgan.token('bodyToken', 
        (req, _) => JSON.stringify(req.body))
app.use(morgan('tiny',
            { skip: (req, res) => hasJSONBody(req, res) }))
app.use(morgan(':method :url :status :res[content-length]  - :response-time ms :bodyToken', 
            { skip:  (req, res) => !hasJSONBody(req, res) }))

const persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    Person.find()
          .then(persons => persons.map(p => p.toJSON()))
          .then((persons) => {
            response.json(persons)
          })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        }).catch(error => next(error))
})

const sendError = (response, message) => {
    response.status(400).json({error: message})
}

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (name === undefined) {
        return sendError(response, 'name must be present')
    }

    if (number === undefined) {
        return sendError(response, 'phone must be present')
    }
    
    const newPerson = new Person({ name, number })
    
    newPerson.save()
     .then(returnedPerson => {
        response.status(201).json(returnedPerson)
     })
})

app.get('/info', (request, response) => {
    const date = new Date().toString()
    const numberOfPeople = persons.length
    const responseString = `<p>Phonebook has info for ${numberOfPeople} people</p>` 
                                + date
    response.send(responseString)
})

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'Malformed id'})
    }
    next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`)
})