const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReferentielSchema = new Schema({
    nom: {
        type: String,
        required: true,
        unique:true
    },
    donnees: {
        type: [String],
        required: false
    },
    antenneId: {
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


ReferentielSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            this.dateCreation = Date.now()
        }
        next()
    } catch (error) {
        next(error)
    }
})


ReferentielSchema.pre('updateOne', async function (next) {
    try {
        this.dateModification = Date.now()
      next()
    } catch (error) {
      next(error)
    }
  })
const Referentiel = mongoose.model('referentiel', ReferentielSchema)
module.exports = Referentiel