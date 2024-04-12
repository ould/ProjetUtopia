const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatSchema = new Schema({

  nom: {
    type: String,
    required: true,
  },
  messagesId: {
    type: [String],
    required: true,
  },
  droitsLecturePersonneId: {
    type: [String],
    required: false,
  },
  droitsEcriturePersonneId: {
    type: [String],
    required: true,
  },
  antenne: {
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
  },
  dateModification: {
    type: Date,
    required: false,
  },
  modifiePar: {
    type: String,
    required: false,
  }
})

ChatSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.dateCreation = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})

ChatSchema.pre('updateOne', async function (next) {
  try {
    this.dateModification = Date.now()
    next()
  } catch (error) {
    next(error)
  }
})

const Chat = mongoose.model('chat', ChatSchema)
module.exports = Chat
