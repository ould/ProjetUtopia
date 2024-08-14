const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InitialiseSchema = new Schema({

  lancePar: {
    type: String
  },
  dateCreation: {
    type: Date
  }
})

InitialiseSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.dateCreation = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})

const Initialise = mongoose.model('initialise', InitialiseSchema)
module.exports = Initialise
