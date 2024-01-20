const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FamilleSchema = new Schema({
  id: {
    type: String,
    required: false,
  },
  nomFamille: {
    type: String,
    required: true,
  },
  personnesId: {
    type: Array,
    required: true,
  },
  composition: {
    type: String,
    required: true,
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

const Famille = mongoose.model('famille', FamilleSchema)
module.exports = Famille
