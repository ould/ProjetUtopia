const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const e = require('express')

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
  profilId:{
    type: String,
    required: false,
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
  antenneDefautId: {
    type: String,
    required: true,
  },
  derniereConnexion: { //TODO a mettre en place 
    type: Date,
    required: false,
  },
  tentativeConnexion: { //TODO a mettre en place 
    type: Number,
    required: false,
  },
  emailValide: {
    type: Boolean,
    required: false,
  },
  derniereModificationMdp: {
    type: Date,
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

UserSchema.pre('save', async function (next) {
  try {
    /* 
    Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
    */
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
      this.profilId = "0" // empeche la creation d'un utilisateur avec profil prerempli => assignation profil manuelle 
      this.dateCreation = Date.now()
      this.antenneDefautId = this.antennes[0]
      this.derniereModificationMdp = null
      this.derniereConnexion = null
      this.tentativeConnexion = 0
    }
    next()
  } catch (error) {
    next(error)
  }
})


UserSchema.pre('updateOne', async function (next) {
  try {
    const update = this.getUpdate();
    if (update['password']) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(update.password, salt);
      update.password = hashedPassword;
      update.derniereModificationMdp = Date.now();
    }
    update.dateModification = Date.now()
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
