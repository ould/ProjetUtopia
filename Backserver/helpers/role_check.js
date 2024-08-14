const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const Groupe = require('../Models/Groupe.model')
const User = require('../Models/User.model')
const Droit = require('../Models/Droit.model')

const nomGroupeAdmin = "Admin"
const nomGroupeFamille = "Famille"
const nomGroupeMineur = "Mineur"
const nomGroupeHebergement = "Hebergement"
const nomGroupeBenevole = "Benevole"
const nomGroupeAdherent = "Adherent"
const nomGroupeAstreinte = "Astreinte"
const nomGroupeHommeSeul = "HommeSeul"
const nomGroupeRapports = "Rapports"
const nomGroupeStock = "Stock"
const nomGroupeChat = "Chat"

const nomDroitAdmin = "Admin"
const nomDroitLecture = "Lecture"
const nomDroitAjout = "Ajout"
const nomDroitModification = "Modification"
const nomDroitSuppression = "Suppression"

module.exports = {
  haveAdminGroupe: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeAdmin, "Not Admin")
  },

  haveGroupeFamille: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeFamille, "Not Famile group")
  },

  haveGroupeHebergement: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeHebergement, "Not Hebergement group")
  },

  haveGroupeBenevole: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeBenevole, "Not Benevole group")
  },

  haveGroupeAdherent: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeAdherent, "Not Adherent group")
  },

  haveGroupeMineur: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeMineur, "Not Mineur group")
  },

  haveGroupeAstreinte: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeAstreinte, "Not Astreinte group")
  },
  haveGroupeHommeSeul: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeHommeSeul, "Not HommeSeul group")
  },
  haveGroupeRapports: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeRapports, "Not Rapports group")
  },
  haveGroupeStock: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeStock, "Not Stock group")
  },
  haveGroupeChat: async (req, res, next) => {
    haveGroupe(req, res, next, nomGroupeChat, "Not Chat group")
  },
  //Droits
  haveDroits: async (req, res, next) => {
    verifieDroitSelonRequete(req, res, next)
  },
  haveDroitAdmin: async (req, res, next) => {
    haveDroit(req, res, next, nomDroitAdmin, "Not droit Admin")
  },
  haveDroitLecture: async (req, res, next) => {
    haveDroit(req, res, next, nomDroitLecture, "Not droit Lecture")
  },
  haveDroitModification: async (req, res, next) => {

  },
}


async function haveGroupe(req, res, next, groupe, message) {
  try {
    const userId = req.payload.userId;
    const groupeAChek = await Groupe.findOne({ nom: groupe });
    const user = await User.findOne({ _id: userId });
    const isGroupe = user.groupes.includes(groupeAChek._id);
    if (isGroupe)
      return next()
    else {
      return next(createError.Unauthorized(message))
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

async function verifieDroitSelonRequete(req, res, next) {
  try {
      if (req.method === 'GET') {
        haveDroit(req, res, next, nomDroitLecture, "Not droit Lecture")
      }
      if (req.method === 'POST') {
        haveDroit(req, res, next, nomDroitAjout, "Not droit Ajout")
      }
      if (req.method === 'PUT') {
        haveDroit(req, res, next, nomDroitModification, "Not droit Modification")
      }
      if (req.method === 'DELETE') {
        haveDroit(req, res, next, nomDroitSuppression, "Not droit Suppression")
      }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

async function haveDroit(req, res, next, nomDroit, message) {
  try {
    const userId = req.payload.userId;
    const droitAdmin = await Droit.findOne({ nom: nomDroitAdmin });
    const user = await User.findOne({ _id: userId });
    const haveDroitAdmin = user.droits.includes(droitAdmin._id);
    // Si droit admin alors OK pour tout 
    if(haveDroitAdmin) return next()
      
      // Si pas admin, on teste les droits selon la requete 
    const droitAChek = await Droit.findOne({ nom: nomDroit });
    const haveDroit = user.droits.includes(droitAChek._id);
    if (haveDroit)
      return next()
    else {
      return next(createError.Unauthorized(message))
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

