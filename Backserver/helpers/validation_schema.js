const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
})

const familleSchema = Joi.object({
  familleId: Joi.string().lowercase().required(),
  nomFamille: Joi.string().required(),
  personnesId: Joi.array().required(),
  composition: Joi.string().required(),
  nationalite: Joi.string().required(),
  
  commentaire: Joi.string().optional()
})

const personneSchema = Joi.object({
  id: Joi.string().hex().length(24).optional(),
  type: Joi.number().required(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  nationalite: Joi.string().required(),
  
  ddn: Joi.date().optional(),
  situation: Joi.string().optional(),
  email: Joi.string().email().lowercase().optional(),
  telephone: Joi.string().optional(),
  commentaire: Joi.string().optional()
})

module.exports = {
  authSchema,
  personneSchema,
  familleSchema
}
