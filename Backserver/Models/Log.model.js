const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = new Schema({
  message:{
    type: String,
    required: true,
  },
  application:{
    type: String,
    required: true,
  },
  type:{
    type: String,
    required: true,
  },
  operation:{
    type: String,
    required: true,
  },
  utilisateurId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  }
})

LogSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        this.date = Date.now()
      }
      next()
    } catch (error) {
      next(error)
    }
  })
  

const Log = mongoose.model('log', LogSchema)
module.exports = Log
