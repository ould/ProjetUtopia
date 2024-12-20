const object = require('@hapi/joi/lib/types/object')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HistoriqueSchema = new Schema({
    entitee: {
        type: String,
        required: true
    },
    objetId: {
        type: String,
        required: true
    },
    champ: {
        type: String,
        required: true
    },
    ancienneValeur: {
        type: Object,
        required: true
    },
    nouvelleValeur: {
      type: Object,
      required: true,
    },
    utilisateurId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: false,
    }
})


HistoriqueSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            this.date = Date.now()
        }
        next()
    } catch (error) {
        next(error)
    }
})

const Historique = mongoose.model('historique', HistoriqueSchema)
module.exports = Historique