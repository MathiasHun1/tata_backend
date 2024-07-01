require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Day = require('./models/openings')
const path = require('path')

const frontend = path.join(__dirname, 'dist')

console.log(frontend);

morgan.token('content', function getContent (req) {
  return JSON.stringify(req.body) 
})

const PORT = process.env.PORT

const requestLogger = (request, response, next) => {
  console.log(request.method);
  console.log(request.path);
  console.log(request.body);
  console.log('-------------');
  next()
}

app.use(express.static('dist'))
app.use('/', express.static(frontend))
app.use(cors())
app.use(express.json())
app.use(requestLogger)
// app.use(morgan())


// Getting all opening days
app.get('/api/openings', (request, response, next) => {
  Day.find({})
    .then(result => {
      response.json(result)
    })
})

// Get a specific day by day-name
app.get('/api/openings/:openingDay', (request, response, next) => {
    const openingDay = request.params.openingDay

  Day.findOne({ day: openingDay })
    .then(existingDay => {
      if(existingDay) {
        response.json(existingDay)
      } else {
        response.status(404).json({message: 'Not a valid day'})
      }
    })
    .catch(error => response.status(500).json({error: error}))
})

// Adding a new opening day, if not exists
app.post('/api/openings', (request, response, next) => {
  const {day, open, close} = request.body
  if(!day || !open || !close) {
    return response.status(400).json({message: 'Content missing'})
  }

  Day.findOne({day: day})
    .then(existingDay => {
      if(existingDay) {
        return response.status(400).json({error: `${day} already exists`})
      } 

      const newDay = new Day({day, open, close})
      return newDay.save()
    })
    .then(result => {
      response.status(201).end()
    })
    .catch(error => {
      if(error.name === 'ValidationError') {
        response.status(400).json({error: error.message})
      }
    })
})

//  Update a specific days opening time
app.put('/api/openings/:openingDay', (request, response, next) => {
  const openingDay = request.params.openingDay
  const {open, close} = request.body

  if(open !== null && !open) {
    return response.status(400).json({error: 'Invalid or missing properties'})
  }

  if(close !== null && !close) {
    return response.status(400).json({error: 'Invalid or missing properties'})
  }

  Day.findOneAndUpdate(
    {day: openingDay}, 
    {open: open, close: close}, 
    {new: true, runValidators: true, context: 'query'})
    .then(updatedDay => {
      if(updatedDay) {
        return response.status(200).end()
      } else {
        return response.status(404).json({error: `${openingDay} not exists`})
      }
    })
    .catch(error => {
      if(error.name === 'ValidationError') {
        response.status(400).json({error: error.message})
      } else {
        response.status(404).json({error: error.message})
      }
    })
})

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
})