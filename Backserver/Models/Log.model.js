const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = new Schema({
  message:{
    type: String,
    required: true,
  },
  importance:{
    type: String,
    required: true,
  },
  creePar: {
    type: String,
    required: true,
  },
  dateCreation: {
    type: Date,
    required: false,
  }
})

LogSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        this.dateCreation = Date.now()
      }
      next()
    } catch (error) {
      next(error)
    }
  })
  

const Log = mongoose.model('log', LogSchema)
module.exports = Log
