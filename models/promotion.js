const mongoose = require('mongoose')

const promoSchema = new mongoose.Schema({
    onPromotion: Boolean,
    text: String
})

promoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id,
        delete returnedObject.__v
    }
})

const Promotion = mongoose.model('Promotion', promoSchema)
module.exports = Promotion