const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EvenementSchema = new Schema({
    entitee: {
        type: String,
        required: true
    },
    entiteeId: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: false
    },
    antenneId: {
      type: String,
      required: true,
    },
    commentaire: {
        type: String,
        required: false
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


EvenementSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            this.dateCreation = Date.now()
        }
        next()
    } catch (error) {
        next(error)
    }
})

EvenementSchema.pre('updateOne', async function (next) {
    try {
        this.dateModification = Date.now()
      next()
    } catch (error) {
      next(error)
    }
  })

const Evenement = mongoose.model('evenement', EvenementSchema)
module.exports = Evenement