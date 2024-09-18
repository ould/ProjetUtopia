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
  nom: Joi.string().min(5).required(),
  beneficiairesId : Joi.array().required(),
  
  composition: Joi.string().optional(),
  antenneId:Joi.string().optional(),
  commentaire: Joi.string().optional()
})

const beneficiaireSchema = Joi.object({
  nom: Joi.string().required(),

  _id: Joi.string().hex().length(24).optional(),
  parentId:Joi.string().optional(),
  type: Joi.string().optional(),
  
  prenom: Joi.string().optional(),
  nationalite: Joi.string().optional(),
  ddn: Joi.string().optional(),
  situation: Joi.string().optional(),
  procedure: Joi.string().optional(),
  email: Joi.string().email().lowercase().optional(),
  telephone: Joi.string().optional(),
  commentaire: Joi.string().optional(),
  antenneId:Joi.string().optional()
  
})

const chatSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required(),
  messagesId: Joi.array().required(),
  droitsLecturePersonneId: Joi.array().required(),
  droitsEcriturePersonneId: Joi.array().required(),
  antenneId:Joi.string().optional()
})

const messageSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  idPersonne: Joi.string().required(),
  message: Joi.string().required(),
  date: Joi.date().required(),
  antenne:Joi.string().optional()
})


const referentielSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required().messages({
    'string.base': `"nom" doit être un type de chaîne`,
    'string.empty': `"nom" ne peut pas être vide`,
    'any.required': `"nom" est un champ requis`
  }),
  donnees: Joi.array().items(Joi.string()).optional().messages({
    'array.base': `"donnees" doit être un tableau`,
    'string.base': `"donnees" doit contenir des chaînes`
  }),
  creePar: Joi.string().required().messages({
    'string.base': `"creePar" doit être un type de chaîne`,
    'string.empty': `"creePar" ne peut pas être vide`,
    'any.required': `"creePar" est un champ requis`
  }),
  dateCreation: Joi.date().optional().messages({
    'date.base': `"dateCreation" doit être une date valide`
  }),
  dateModification: Joi.date().optional().messages({
    'date.base': `"dateModification" doit être une date valide`
  }),
  modifiePar: Joi.string().optional().messages({
    'string.base': `"modifiePar" doit être un type de chaîne`
  })
});

const historiqueSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  entitee: Joi.string().required().messages({
      'string.base': `"entitee" doit être un type de chaîne`,
      'string.empty': `"entitee" ne peut pas être vide`,
      'any.required': `"entitee" est un champ requis`
  }),
  entiteeId: Joi.string().required().messages({
      'string.base': `"entiteeId" doit être un type de chaîne`,
      'string.empty': `"entiteeId" ne peut pas être vide`,
      'any.required': `"entiteeId" est un champ requis`
  }),
  action: Joi.string().required().messages({
      'string.base': `"action" doit être un type de chaîne`,
      'string.empty': `"action" ne peut pas être vide`,
      'any.required': `"action" est un champ requis`
  }),
  detail: Joi.string().optional().messages({
      'string.base': `"detail" doit être un type de chaîne`
  }),
  creePar: Joi.string().required().messages({
      'string.base': `"creePar" doit être un type de chaîne`,
      'string.empty': `"creePar" ne peut pas être vide`,
      'any.required': `"creePar" est un champ requis`
  }),
  dateCreation: Joi.date().optional().messages({
      'date.base': `"dateCreation" doit être une date valide`
  })
});

const evenementSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  entitee: Joi.string().required().messages({
      'string.base': `"entitee" doit être un type de chaîne`,
      'string.empty': `"entitee" ne peut pas être vide`,
      'any.required': `"entitee" est un champ requis`
  }),
  entiteeId: Joi.string().required().messages({
      'string.base': `"entiteeId" doit être un type de chaîne`,
      'string.empty': `"entiteeId" ne peut pas être vide`,
      'any.required': `"entiteeId" est un champ requis`
  }),
  nom: Joi.string().required().messages({
      'string.base': `"nom" doit être un type de chaîne`,
      'string.empty': `"nom" ne peut pas être vide`,
      'any.required': `"nom" est un champ requis`
  }),
  date: Joi.string().optional().messages({
      'string.base': `"date" doit être un type de chaîne`
  }),
  commentaire: Joi.string().optional().messages({
      'string.base': `"commentaire" doit être un type de chaîne`
  }),
  creePar: Joi.string().required().messages({
      'string.base': `"creePar" doit être un type de chaîne`,
      'string.empty': `"creePar" ne peut pas être vide`,
      'any.required': `"creePar" est un champ requis`
  }),
  dateCreation: Joi.date().optional().messages({
      'date.base': `"dateCreation" doit être une date valide`
  })
});

module.exports = {
  authSchema,
  beneficiaireSchema,
  familleSchema,
  userSchema,
  chatSchema,
  messageSchema,
  profilSchema,
  logSchema,
  referentielSchema,
  historiqueSchema,
  evenementSchema
}
