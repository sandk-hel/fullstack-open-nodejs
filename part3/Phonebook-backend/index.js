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

app.get('/api/persons', (request, response) => {
    Person.find()
          .then(persons => persons.map(p => p.toJSON()))
          .then((persons) => {
            response.json(persons)
          })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
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

app.post('/api/persons', (request, response, next) => {
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
     }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const name = request.body.name
    const number = request.body.number
    const updatePerson = { name, number }
    Person.findByIdAndUpdate(request.params.id, updatePerson, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.count({})
        .then((numberOfPersons) => {
            const date = new Date().toString()

            const responseString = `<p>Phonebook has info for ${numberOfPersons} people</p>` 
            + date
            response.send(responseString)
        }).catch(error => next(error))
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