const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  groupes:{
    type: [String],
    required: true,
  },
  nom:{
    type: String,
    required: true,
  },
  prenom:{
    type: String,
    required: true,
  },
  antennes: {
    type: [String],
    required: true,
  },
  antenneDefaut: {
    type: [String],
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
  dateModification : {
    type: Date,
    required: false,
  },
  modifiePar : {
    type: String,
    required: false,
  }
})

UserSchema.pre('save', async function (next) {
  try {
    /* 
    Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
    */
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
      this.groupes = []
      this.dateCreation = Date.now()
      this.antenneDefaut = antennes[0]
    }
    next()
  } catch (error) {
    next(error)
  }
})


UserSchema.pre('updateOne', async function (next) {
  try {
      this.dateModification = Date.now()
    next()
  } catch (error) {
    next(error)
  }
})


UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

const User = mongoose.model('user', UserSchema)
module.exports = User
