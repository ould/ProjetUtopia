const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupeSchema = new Schema({

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
    required: false,
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

GroupeSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.dateCreation = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})


GroupeSchema.pre('updateOne', async function (next) {
  try {
    this.dateModification = Date.now()
    next()
  } catch (error) {
    next(error)
  }
})




const Groupe = mongoose.model('groupe', GroupeSchema)
module.exports = Groupe
