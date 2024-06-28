const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const URL = process.env.URL

mongoose.connect(URL)
  .then(response => console.log('Connected to MongoDB'))
  .catch(error => console.log(error.errorResponse.errmsg))

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    validate: {
      validator: (day) => {
        return ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].includes(day)
      },
      message: props => `${props.value} is not a valid day!`,
    },
  },
  open: {
      type: String,
      validate: {
        validator: (v) => {
          const isValidFormat = /^(?:[01]?[0-9]|2[0-4])\.[0-5][0-9]$/.test(v)

          return isValidFormat || (v === null) ? true : false
        },
        message: props => `${props.value} is not a valid time`
      },
    },
  close: {
      type: String,
      validate: {
        validator: (v) => {
          const isValidFormat = /^(?:[01]?[0-9]|2[0-4])\.[0-5][0-9]$/.test(v)
          return isValidFormat || (v === null) ? true : false
        },
        message: props => `${props.value} is not a valid time`
      },
    },
})

daySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Day = new mongoose.model('Day', daySchema)

module.exports = Day