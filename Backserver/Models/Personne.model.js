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

const Personne = mongoose.model('personne', PersonneSchema)
module.exports = Personne
