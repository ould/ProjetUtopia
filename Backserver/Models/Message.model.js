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
  },
  creePar: {
    type: String,
    required: true,
  },
  DateCreation: {
    type: Date,
    required: true,
  },
  dateModification : {
    type: Date,
    required: false,
  },
  modifiePar : {
    type: String,
    required: false,
  }
})

const Message = mongoose.model('message', MessageSchema)
module.exports = Message