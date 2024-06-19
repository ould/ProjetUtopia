const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),

  passwordConfirm: Joi.string().optional(),
  groupes: Joi.array().optional(),
  nom: Joi.string().optional(),
  prenom: Joi.string().optional(),
  antennes: Joi.array().optional()

})

const userSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  
  groupes: Joi.array().required(),
  antennes: Joi.array().required(),
  antenneDefaut: Joi.string().optional()
})

const logSchema = Joi.object({
  message: Joi.string().required(),
  importance: Joi.string().optional(),
  creePar: Joi.string().optional(),
  dateCreation: Joi.string().optional()

})

const familleSchema = Joi.object({
  id: Joi.string().hex().length(24).optional(),
  nomFamille: Joi.string().min(5).required(),
  personnesId: Joi.array().required(),
  composition: Joi.string().required(),

  commentaire: Joi.string().optional(),

  creePar: Joi.string().optional(),
  dateCreation: Joi.string().optional(),
  dateModification: Joi.string().optional(),
  modifiePar: Joi.string().optional()
})

const personneSchema = Joi.object({
  id: Joi.string().hex().length(24).optional(),
  type: Joi.number().required(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),

  nationalite: Joi.string().optional(),
  ddn: Joi.date().optional(),
  situation: Joi.string().optional(),
  email: Joi.string().email().lowercase().optional(),
  telephone: Joi.string().optional(),
  commentaire: Joi.string().optional(),

  creePar: Joi.string().optional(),
  dateCreation: Joi.string().optional(),
  dateModification: Joi.string().optional(),
  modifiePar: Joi.string().optional()
})

const chatSchema = Joi.object({
  id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required(),
  messagesId: Joi.array().required(),
  droitsLecturePersonneId: Joi.array().required(),
  droitsEcriturePersonneId: Joi.array().required(),

  creePar: Joi.string().optional(),
  dateCreation: Joi.string().optional(),
  dateModification: Joi.string().optional(),
  modifiePar: Joi.string().optional()
})

const messageSchema = Joi.object({
  id: Joi.string().hex().length(24).optional(),
  idPersonne: Joi.string().required(),
  message: Joi.string().required(),
  date: Joi.date().required(),

  creePar: Joi.string().optional(),
  dateCreation: Joi.string().optional(),
  dateModification: Joi.string().optional(),
  modifiePar: Joi.string().optional()
})

const groupeSchema = Joi.object({
  id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required(),
  commentaire: Joi.string().optional(),

  creePar: Joi.string().optional(),
  dateCreation: Joi.string().optional(),
  dateModification: Joi.string().optional(),
  modifiePar: Joi.string().optional()
})


const personneTypeSchema = Joi.object({
  id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().optional(),
  commentaire: Joi.string().optional(),

  creePar: Joi.string().optional(),
  dateCreation: Joi.string().optional(),
  dateModification: Joi.string().optional(),
  modifiePar: Joi.string().optional()
})


module.exports = {
  authSchema,
  personneSchema,
  familleSchema,
  userSchema,
  chatSchema,
  messageSchema,
  groupeSchema,
  personneTypeSchema,
  logSchema
}
