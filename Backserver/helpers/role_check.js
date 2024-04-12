const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const Groupe = require('../Models/Groupe.model')
const User = require('../Models/User.model')

const nomGroupeAdmin = "Admin"
const nomGroupeFamille = "Famille"
const nomGroupeMineur = "Mineur"
const nomGroupeHebergement = "Hebergement"
const nomGroupeBenevole = "Benevole"
const nomGroupeAdherent = "Adherent"

module.exports = {
  haveAdminRole: async (req, res, next) => {
    haveRole(req, res, next, nomGroupeAdmin, "Not Admin")
  },

  haveRoleFamille: async (req, res, next) => {
    haveRole(req, res, next, nomGroupeFamille, "Not Famile group")
  },

  haveRoleHebergement: async (req, res, next) => {
    haveRole(req, res, next, nomGroupeHebergement, "Not Hebergement group")
  },

  haveRoleBenevole: async (req, res, next) => {
    haveRole(req, res, next, nomGroupeBenevole, "Not Benevole group")
  },

  haveRoleAdherent: async (req, res, next) => {
    haveRole(req, res, next, nomGroupeAdherent, "Not Adherent group")
  },

  haveRoleMineur: async (req, res, next) => {
    haveRole(req, res, next, nomGroupeMineur, "Not Mineur group")
  },
}

async function haveRole(req, res, next, role, message) {
  try {
    const userId = req.payload.userId;
    const groupeAChek = await Groupe.findOne({ nom: role });
    const user = await User.findOne({ _id: userId });
    const isRole = user.groupes.includes(groupeAChek._id);
    if (isRole)
      return next()
    else {
      return next(createError.Unauthorized(message))
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}
