const mongoose = require('mongoose')

const vacationSchema = new mongoose.Schema({
  onVacation: Boolean,
  text: String
})

vacationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Vacation = new mongoose.model('Vacation', vacationSchema)
module.exports = Vacation