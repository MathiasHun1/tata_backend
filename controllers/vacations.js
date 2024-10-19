const vacationsRouter = require('express').Router()
const Vacation = require('../models/vacation')

// get vacations data
vacationsRouter.get('/', (request, response) => {
  Vacation
    .find({})
    .then(result => {
      response.json(result)
    })
})

// ADD new vacations obj
vacationsRouter.post('/', (request, response) => {
  const {onVacation, text} = request.body

  if(!onVacation || !text) {
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

vacationsRouter.put('/', (request, response) => {
  const { onVacation, text } = request.body

  if(onVacation === undefined || !text) {
    return response.status(400).json({error: 'Content missing!'})
  }

  Vacation.findOne({})
    .then(result => {
      result.onVacation = onVacation
      result.text = text
      result
        .save()
        .then( r => response.status(200).end() )
    })
    .catch(error => response.json({error: error.message}))

})

module.exports = vacationsRouter