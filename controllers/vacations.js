const vacationsRouter = require('express').Router()
const Vacation = require('../models/vacation')

// Get vacations data
vacationsRouter.get('/', async (request, response) => {
  try {
    const result = await Vacation.findOne({})
    return response.status(200).json(result)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

// ADD new vacations obj
vacationsRouter.post('/', async (request, response) => {
  const vacationObj = new Vacation({ onVacation: false, text: '' })
  try {
    const dbState = await Vacation.find({})
    console.log('DbState:', dbState.length)
    
    if (dbState.length !== 0) {
      return response.status(400).json({ error: 'database contains a vacation object already, you can\'t add more' })
    }
    const result = await vacationObj.save()
    return response.status(201).json(result)
  } catch (error) {
    response.status(400).json({error: error.message})
  }
})

//Update vacations data
vacationsRouter.put('/', async (request, response) => {
  const { onVacation, text } = request.body

  if(onVacation === undefined || text === undefined) {
    return response.status(400).json({error: 'Content missing!'})
  }

  try {
    const result = await Vacation.findOne({})
    result.onVacation = onVacation
    result.text = text
    const savedResult = await result.save()
    response.status(200).json(savedResult)
  } catch (error) {
    response.status(400).json({error: error.message})
  }
})

vacationsRouter.delete('/', async (request, response) => {
  try {
    await Vacation.deleteMany({})
      return response.status(204).end()
  } catch (error) {
      console.log(error);
  }
})

module.exports = vacationsRouter