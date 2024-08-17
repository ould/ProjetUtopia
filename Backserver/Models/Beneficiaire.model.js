const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BeneficiaireSchema = new Schema({
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
  procedure: {
    type: String,
    required: false,
  },
  commentaire: {
    type: String,
    required: false,
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

BeneficiaireSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.dateCreation = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})

BeneficiaireSchema.pre('updateOne', async function (next) {
  try {
    this.dateModification = Date.now()
    next()
  } catch (error) {
    next(error)
  }
})

const Beneficiaire = mongoose.model('beneficiaire', BeneficiaireSchema)
module.exports = Beneficiaire
