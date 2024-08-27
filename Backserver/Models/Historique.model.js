const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HistoriqueSchema = new Schema({
    entitee: {
        type: String,
        required: true
    },
    entiteeId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: false
    },
    antenneId: {
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
    }
})


HistoriqueSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            this.dateCreation = Date.now()
        }
        next()
    } catch (error) {
        next(error)
    }
})

const Historique = mongoose.model('historique', HistoriqueSchema)
module.exports = Historique