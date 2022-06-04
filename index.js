require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: function (req, res) { return res.statusCode !== 201}
}))
app.use(morgan('tiny', {
    skip: function (req, res) { return res.statusCode === 201}
}))
app.use(express.json())

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
  .catch((err) => response.status(400).json({ error: err }))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
    .catch((err) => response.status(400).json({ error: err }))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch((err) => response.status(400).json({ error: err }))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.deleteOne(request.params.id).then(person => {
    response.status(200).json({success: true})
  })
  .catch((err) => response.status(400).json({ error: err }))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})