const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatSchema = new Schema({

  nom: {
    type: String,
    required: true,
  },
  messagesId: {
    type: Array,
    required: true,
  },
  droitsLecturePersonneId: {
    type: Array,
    required: false,
  },
  droitsEcriturePersonneId: {
    type: Array,
    required: true,
  },
  creePar: {
    type: String,
    required: true,
  },
  dateCreation: {
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

const Chat = mongoose.model('chat', ChatSchema)
module.exports = Chat
