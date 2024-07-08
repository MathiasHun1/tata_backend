const daysRouter = require('express').Router()
const Day = require('../models/day')
const path = require('path')

// Getting all opening days
daysRouter.get('/', (request, response, next) => {
  Day.find({})
    .then(result => {
      response.json(result)
    })
})

// Get a specific day by day-name
daysRouter.get('/:openingDay', (request, response, next) => {
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
daysRouter.post('/', (request, response, next) => {
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
daysRouter.put('/:openingDay', (request, response, next) => {
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

daysRouter.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

module.exports = daysRouter