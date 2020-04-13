const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

const isPOSTRequest = (req, _) => {
    return req.method === "POST"
}

morgan.token('bodyToken', 
        (req, _) => JSON.stringify(req.body))
app.use(morgan('tiny',
            { skip: (req, res) => isPOSTRequest(req, res) }))
app.use(morgan(':method :url :status :res[content-length]  - :response-time ms :bodyToken', 
            { skip:  (req, res) => !isPOSTRequest(req, res) }))

let persons = [
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
    response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const sendError = (response, message) => {
    response.status(400).json({error: message})
}

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (name === undefined) {
        sendError(response, 'name must be present')
        return 
    }

    if (number === undefined) {
        sendError(response, 'phone must be present')
        return
    }

    const existingPerson = persons.find(p => p.name.toLowerCase() === name.toLowerCase())
    if (existingPerson) {
        sendError(response, 'name must be unique')
        return
    }
    
    const id = Math.floor(Math.random() * 1000000)
    const person = { id, name, number }
    persons = [...persons, person]
    response.status(201).json(person)
})

app.get('/info', (request, response) => {
    const date = new Date().toString()
    const numberOfPeople = persons.length
    const responseString = `<p>Phonebook has info for ${numberOfPeople} people</p>` 
                                + date
    response.send(responseString)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`)
})