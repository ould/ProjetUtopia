const { date } = require('@hapi/joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OperationEnum = Object.freeze({
    REINITIALISATION_MDP: 'REINITIALISATION_MDP',
    CONFIRMEMAIL: 'CONFIRMEMAIL'
});

const LienTempSchema = new Schema({
    hash: {
        type: String,
        required: true,
    },
    operation: {
        type: String,
        required: true,
        enum: Object.values(OperationEnum),
    },
    cibleId: {
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
    dateExpiration: {
        type: Date,
        required: true,
    }
});



LienTempSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        this.dateCreation = Date.now()
      }
      next()
    } catch (error) {
      next(error)
    }
  })
  

const LienTemp = mongoose.model('lienTemp', LienTempSchema)
module.exports = {
    LienTemp,
    OperationEnum
};
