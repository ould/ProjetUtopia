const Joi = require('@hapi/joi')

//Validations entre API et Front (different de la validation en base de données => models)
// En resumé, ce que le back doit recevoir pour accepter l'objet 

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),

  passwordConfirm: Joi.string().optional(),
  profilId: Joi.array().optional(),
  profilId: Joi.array().optional(),
  nom: Joi.string().optional(),
  prenom: Joi.string().optional(),
  antennes: Joi.array().optional()
})

const userSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  
  password: Joi.string().min(2).optional(),
  profilId: Joi.string().optional(),
  antennes: Joi.array().optional(),
  antenneDefautId: Joi.string().optional()
})

const profilSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required(),
  tableauDroits: Joi.array().items(
    Joi.object({
      section: Joi.string().required(),
      drtois: Joi.string().optional()
    })
  ).required(),

  commentaire: Joi.string().optional(),
  creePar: Joi.string().optional(),
  dateCreation: Joi.date().optional(),
  modifiePar: Joi.string().optional(),
  dateModification: Joi.date().optional()
})

const logSchema = Joi.object({
  message: Joi.string().required(),
  type: Joi.string().required(),
  importance: Joi.string().optional()
})

const familleSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nomFamille: Joi.string().min(5).required(),
  beneficiaires : Joi.array().required(),
  composition: Joi.string().required(),

  antenne:Joi.string().optional(),
  commentaire: Joi.string().optional()
})

const beneficiaireSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  
  type: Joi.string().optional(),
  nationalite: Joi.string().optional(),
  ddn: Joi.date().optional(),
  situation: Joi.string().optional(),
  procedure: Joi.string().optional(),
  email: Joi.string().email().lowercase().optional(),
  telephone: Joi.string().optional(),
  commentaire: Joi.string().optional(),
  antenne:Joi.string().optional(),
  
  parentId:Joi.string().optional()
})

const chatSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required(),
  messagesId: Joi.array().required(),
  droitsLecturePersonneId: Joi.array().required(),
  droitsEcriturePersonneId: Joi.array().required(),
  antenne:Joi.string().optional()
})

const messageSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  idPersonne: Joi.string().required(),
  message: Joi.string().required(),
  date: Joi.date().required(),
  antenne:Joi.string().optional()
})

module.exports = {
  authSchema,
  beneficiaireSchema,
  familleSchema,
  userSchema,
  chatSchema,
  messageSchema,
  profilSchema,
  logSchema
}
