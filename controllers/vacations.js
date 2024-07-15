const vacationsRouter = require('express').Router()
const Vacation = require('../models/vacation')

// ADD new vacations obj
vacationsRouter.post('/', (request, response) => {
  const {onVacation, text} = request.body

  if(!onVacation, !text) {
    return response.status(400).json({error: 'Content missing!'})
  }

  const vacationObj = new Vacation({ onVacation, text })
  vacationObj
    .save()
    .then(result => {
      response.status(201).end()
    })
    .catch(error => {
      response.status(400).json({error: error.message})
    })
})

module.exports = vacationsRouter