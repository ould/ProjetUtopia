const createError = require('http-errors')
const User = require('../Models/User.model')
const Profil = require('../Models/Profil.model')

module.exports = {
  haveDroits: async (req, res, next) => {
    verifieDroitSelonRequete(req, res, next)
  }
}

//Verifier si acces à la section demandee (url) et avec le bon droit
async function verifieDroitSelonRequete(req, res, next) {
  try {
    if (req.method === 'GET') {
      haveAccesSection(req, res, next, process.env.droit_lecture, "Not droit Lecture")
    }
    if (req.method === 'POST') {
      haveAccesSection(req, res, next, droit_ajout, "Not droit Ajout")
    }
    if (req.method === 'PUT') {
      haveAccesSection(req, res, next, droit_modification, "Not droit Modification")
    }
    if (req.method === 'DELETE') {
      haveAccesSection(req, res, next, droit_suppression, "Not droit Suppression")
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

async function haveAccesSection(req, res, next, nomDroit, message) {
  try {
    const sectionDemandee = req.baseUrl.split('/')[2] 
    const idUtilisateur = req.payload.userId;

    const profilAdmin = await Profil.findOne({ nom: process.env.droit_admin });
    const utilisateur = await User.findOne({ _id: idUtilisateur });
    const aProfilAdmin = utilisateur.profilId.includes(profilAdmin._id);
    // Si droit admin alors OK pour tout 
    if (aProfilAdmin) return next() 

    // Si pas admin, on teste les droits selon la requete 
    const profilUtilisateur = await Profil.findOne({ _id: utilisateur.profilId });
    const haveDroit = profilUtilisateur.tableauDroits.find(item => item.section === sectionDemandee).includes(nomDroit);
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

