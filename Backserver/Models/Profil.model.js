const mongoose = require('mongoose')
const Schema = mongoose.Schema

const keyValueSchema = new Schema({
    section: { type: String, required: true },
    droits: { type: String, required: false }
  });

const ProfilSchema = new Schema({
    nom: {
        type: String,
        required: true,
        unique:true
    },
    tableauDroits: {
        type: [keyValueSchema],
        required: true
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
    dateModification: {
      type: Date,
      required: false,
    },
    modifiePar: {
      type: String,
      required: false,
    }
})


ProfilSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            this.dateCreation = Date.now()
        }
        next()
    } catch (error) {
        next(error)
    }
})

ProfilSchema.pre('updateOne', async function (next) {
    try {
      this.dateModification = Date.now()
      next()
    } catch (error) {
      next(error)
    }
  })

const Profil = mongoose.model('profil', ProfilSchema)
module.exports = Profil
