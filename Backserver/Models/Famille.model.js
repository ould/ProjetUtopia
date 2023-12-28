const { array } = require('@hapi/joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FamilleSchema = new Schema({
  familleId: {
    type: String,
    required: false,
    unique: true,
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
  nationalite: {
    type: String,
    required: true,
  },
  commentaire: {
    type: String,
    required: false,
  }
})

// FamilleSchema.pre('save', async function (next) {
//   try {
//     /* 
//     Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
//     */
//     if (this.isNew) {
//       const salt = await bcrypt.genSalt(10)
//       this.id = hashedPassword
//     }
//     next()
//   } catch (error) {
//     next(error)
//   }
// })

const Famille = mongoose.model('famille', FamilleSchema)
module.exports = Famille
