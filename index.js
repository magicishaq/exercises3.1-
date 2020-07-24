//simple web server
const express = require('express')
const app = express(); //stored in variable app
const morgan = require('morgan')
const cors = require('cors'); 
app.use(cors()); //use cors
app.use(express.json()) //helps to access the data easaily //transform json data into javascript object
//url //statuscode //responsetime and body 
const token = morgan.token('type', (tokens, req,res) => {
return [tokens.method(req,res),
  tokens.url(req,res),
   tokens.status(req,res),
   tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
   ].join(' ')
})



app.use(morgan(token))


//middleware functions
const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  next()
}


const unknownEndpoint = (request, response) => {
  const errorObject = {error: 'Unknown endpoint'}
  response.status(400).send(errorObject)

}

app.use(requestLogger)


let notes = [{
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]
// const app = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' })
//   res.end(JSON.stringify(notes))
// })

// const port = 3001
// app.listen(port)
// console.log(`Server running on port ${port}`)

const generateId = () => {
  //finds the largest id in the ist , spreading the notes in an array and return the math max of the id
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
  return maxId
}
app.post('/api/notes', (request, response) => {
  const body = request.body
  const errorObj = {
    error: 'content missing'
  }
  if (!body.content) {
    return response.status(400).json(errorObj)
  }


  const note = {
    content: body.content,
    important: body.content || false,
    date: new Date(),
    id: generateId()
  }

  notes = notes.concat(note)
  response.json(note)
})


app.get('/', (req, res) => {
  res.send('<h1>Hello World, Ishaq Using nodemon</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

//fetching a single note
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) //params is defined by using the :id syntax
  const note = notes.find(note => note.id === id)
  //because if a note isnt found it returned undetified a note will still set, we must use an if statement to return a 404 response if this happens
  note ? response.json(note) : response.status(404).end() //shows the note


})

//deleting resources
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
