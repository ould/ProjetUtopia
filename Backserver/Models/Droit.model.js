const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DroitSchema = new Schema({

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
  }
})

DroitSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.dateCreation = Date.now()
    }
    next()
  } catch (error) {
    next(error)
  }
})


const Droit = mongoose.model('droit', DroitSchema)
module.exports = Droit