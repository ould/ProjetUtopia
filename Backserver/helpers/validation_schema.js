const Joi = require('@hapi/joi');

// Validations entre API et Front (différent de la validation en base de données => models)

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'string.email': '"email" doit être une adresse email valide',
    'string.empty': '"email" ne peut pas être vide',
    'any.required': '"email" est un champ requis'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': '"password" doit contenir au moins 8 caractères',
    'string.empty': '"password" ne peut pas être vide',
    'any.required': '"password" est un champ requis'
  }),
  passwordConfirm: Joi.string().optional(),
  profilId: Joi.array().items(Joi.string().hex().length(24)).optional().messages({
    'array.base': '"profilId" doit être un tableau de chaînes',
    'string.hex': 'Chaque "profilId" doit être un identifiant valide'
  }),
  nom: Joi.string().optional(),
  prenom: Joi.string().optional(),
  antennes: Joi.array().items(Joi.string().hex().length(24)).optional()
});

const userSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required().messages({
    'string.empty': '"nom" ne peut pas être vide',
    'any.required': '"nom" est un champ requis'
  }),
  prenom: Joi.string().required().messages({
    'string.empty': '"prenom" ne peut pas être vide',
    'any.required': '"prenom" est un champ requis'
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': '"email" doit être une adresse email valide',
    'string.empty': '"email" ne peut pas être vide',
    'any.required': '"email" est un champ requis'
  }),
  password: Joi.string().min(8).optional(),
  profilId: Joi.string().hex().length(24).optional(),
  antennes: Joi.array().items(Joi.string().hex().length(24)).optional(),
  antenneDefautId: Joi.string().hex().length(24).optional()
});

const profilSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required().messages({
    'string.empty': '"nom" ne peut pas être vide',
    'any.required': '"nom" est un champ requis'
  }),
  tableauDroits: Joi.array().items(
    Joi.object({
      section: Joi.string().required().messages({
        'string.empty': '"section" ne peut pas être vide',
        'any.required': '"section" est un champ requis'
      }),
      droits: Joi.string().optional()
    })
  ).required().messages({
    'array.base': '"tableauDroits" doit être un tableau',
    'any.required': '"tableauDroits" est un champ requis'
  }),
  commentaire: Joi.string().optional(),
  creePar: Joi.string().hex().length(24).optional(),
  dateCreation: Joi.date().optional(),
  modifiePar: Joi.string().hex().length(24).optional(),
  dateModification: Joi.date().optional()
});

const logSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  message: Joi.string().required().messages({
    'string.empty': '"message" ne peut pas être vide',
    'any.required': '"message" est un champ requis'
  }),
  type: Joi.string().required().messages({
    'string.empty': '"type" ne peut pas être vide',
    'any.required': '"type" est un champ requis'
  }),
  application: Joi.string().required().messages({
    'string.empty': '"application" ne peut pas être vide',
    'any.required': '"application" est un champ requis'
  }),
  operation: Joi.string().required().messages({
    'string.empty': '"operation" ne peut pas être vide',
    'any.required': '"operation" est un champ requis'
  }),
  utilisateurId: Joi.string().hex().length(24).optional(),
  date: Joi.date().optional()
});

const familleSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().min(5).required().messages({
    'string.min': '"nom" doit contenir au moins 5 caractères',
    'string.empty': '"nom" ne peut pas être vide',
    'any.required': '"nom" est un champ requis'
  }),
  beneficiairesId: Joi.array().items(Joi.string().hex().length(24)).required().messages({
    'array.base': '"beneficiairesId" doit être un tableau',
    'any.required': '"beneficiairesId" est un champ requis'
  }),
  composition: Joi.string().optional(),
  antenneId: Joi.string().hex().length(24).optional(),
  commentaire: Joi.string().optional()
});

const beneficiaireSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required().messages({
    'string.empty': '"nom" ne peut pas être vide',
    'any.required': '"nom" est un champ requis'
  }),
  prenom: Joi.string().optional(),
  parentId: Joi.string().hex().length(24).optional(),
  type: Joi.string().optional(),
  nationalite: Joi.string().optional(),
  ddn: Joi.date().optional().messages({
    'date.base': '"ddn" doit être une date valide'
  }),
  situation: Joi.string().optional(),
  procedure: Joi.string().optional(),
  email: Joi.string().email().lowercase().optional(),
  telephone: Joi.string().optional(),
  commentaire: Joi.string().optional(),
  antenneId: Joi.string().hex().length(24).optional()
});

const chatSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required().messages({
    'string.empty': '"nom" ne peut pas être vide',
    'any.required': '"nom" est un champ requis'
  }),
  messagesId: Joi.array().items(Joi.string().hex().length(24)).required().messages({
    'array.base': '"messagesId" doit être un tableau',
    'any.required': '"messagesId" est un champ requis'
  }),
  droitsLecturePersonneId: Joi.array().items(Joi.string().hex().length(24)).required().messages({
    'array.base': '"droitsLecturePersonneId" doit être un tableau',
    'any.required': '"droitsLecturePersonneId" est un champ requis'
  }),
  droitsEcriturePersonneId: Joi.array().items(Joi.string().hex().length(24)).required().messages({
    'array.base': '"droitsEcriturePersonneId" doit être un tableau',
    'any.required': '"droitsEcriturePersonneId" est un champ requis'
  }),
  antenneId: Joi.string().hex().length(24).optional()
});

const messageSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  idPersonne: Joi.string().hex().length(24).required().messages({
    'string.empty': '"idPersonne" ne peut pas être vide',
    'any.required': '"idPersonne" est un champ requis'
  }),
  message: Joi.string().required().messages({
    'string.empty': '"message" ne peut pas être vide',
    'any.required': '"message" est un champ requis'
  }),
  date: Joi.date().required().messages({
    'date.base': '"date" doit être une date valide',
    'any.required': '"date" est un champ requis'
  }),
  antenne: Joi.string().hex().length(24).optional()
});

const referentielSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  nom: Joi.string().required().messages({
    'string.empty': '"nom" ne peut pas être vide',
    'any.required': '"nom" est un champ requis'
  }),
  donnees: Joi.array().items(Joi.string()).optional(),
  creePar: Joi.string().hex().length(24).required().messages({
    'string.empty': '"creePar" ne peut pas être vide',
    'any.required': '"creePar" est un champ requis'
  }),
  dateCreation: Joi.date().optional(),
  dateModification: Joi.date().optional(),
  modifiePar: Joi.string().hex().length(24).optional()
});

const evenementSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  entitee: Joi.string().required().messages({
    'string.empty': '"entitee" ne peut pas être vide',
    'any.required': '"entitee" est un champ requis'
  }),
  entiteeId: Joi.string().hex().length(24).required().messages({
    'string.empty': '"entiteeId" ne peut pas être vide',
    'any.required': '"entiteeId" est un champ requis'
  }),
  nom: Joi.string().required().messages({
    'string.empty': '"nom" ne peut pas être vide',
    'any.required': '"nom" est un champ requis'
  }),
  date: Joi.date().optional(),
  commentaire: Joi.string().optional(),
  creePar: Joi.string().hex().length(24).required().messages({
    'string.empty': '"creePar" ne peut pas être vide',
    'any.required': '"creePar" est un champ requis'
  }),
  dateCreation: Joi.date().optional()
});

module.exports = {
  authSchema,
  userSchema,
  profilSchema,
  logSchema,
  familleSchema,
  beneficiaireSchema,
  chatSchema,
  messageSchema,
  referentielSchema,
  evenementSchema
};
