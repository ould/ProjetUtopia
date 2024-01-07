const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({

  idPersonne: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  }
})

const Message = mongoose.model('message', MessageSchema)
module.exports = Message