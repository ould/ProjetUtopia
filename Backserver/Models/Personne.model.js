const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonneSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  nationalite: {
    type: String,
    required: false,
  },
  telephone: {
    type: String,
    required: false,
  },
  ddn: {
    type: String,
    required: false,
  },
  situation: {
    type: String,
    required: false,
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

PersonneSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.dateCreation = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})

PersonneSchema.pre('updateOne', async function (next) {
  try {
    if (this.isNew) {
      this.dateModification = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})

const Personne = mongoose.model('personne', PersonneSchema)
module.exports = Personne
