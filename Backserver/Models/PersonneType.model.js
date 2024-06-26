const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonneTypeSchema = new Schema({

  nom: {
    type: String,
    required: true,
    unique: true
  },
  commentaire: {
    type: String,
    required: false,
  },
  creePar: {
    type: String,
    required: true,
  },
  dateCreation: {
    type: Date,
    required: false,
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

PersonneTypeSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.dateCreation = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})


PersonneTypeSchema.pre('updateOne', async function (next) {
  try {
      this.dateModification = Date.now()
    next()
  } catch (error) {
    next(error)
  }
})




const PersonneType = mongoose.model('personneType', PersonneTypeSchema)
module.exports = PersonneType
