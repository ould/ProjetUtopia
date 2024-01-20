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

FamilleSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.dateCreation = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})

FamilleSchema.pre('updateOne', async function (next) {
  try {
    if (this.isNew) {
      this.dateModification = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})

const Famille = mongoose.model('famille', FamilleSchema)
module.exports = Famille
