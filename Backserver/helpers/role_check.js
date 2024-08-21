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
    switch (req.method) {
      case 'GET':
        return await haveAccesSection(req, res, next, process.env.droit_lecture, "Not droit Lecture");
      case 'POST':
        return await haveAccesSection(req, res, next, process.env.droit_ajout, "Not droit Ajout");
      case 'PUT':
        return await haveAccesSection(req, res, next, process.env.droit_modification, "Not droit Modification");
      case 'DELETE':
        return await haveAccesSection(req, res, next, process.env.droit_suppression, "Not droit Suppression");
      default:
        throw new Error("Méthode HTTP non supportée");
    }
  } catch (error) {
    error.message = "Erreur lors de la vérification des droits : " + error.message;
    return next(error);
  }
}

async function haveAccesSection(req, res, next, nomDroit, message) {
  try {
    const sectionDemandee = req.baseUrl.split('/')[2];
    const idUtilisateur = req.payload.userId;

    // Vérifiez si l'utilisateur a le profil admin
    const profilAdmin = await Profil.findOne({ nom: process.env.contexte_admin });
    const utilisateur = await User.findOne({ _id: idUtilisateur });
    const aProfilAdmin = utilisateur.profilId.includes(profilAdmin._id);
    
    if (aProfilAdmin) return next();

    // Si l'utilisateur n'est pas admin, vérifiez les droits spécifiques
    const profilUtilisateur = await Profil.findOne({ _id: utilisateur.profilId });
    const droitSection = profilUtilisateur.tableauDroits.find(item => item.section === sectionDemandee);

    if (droitSection && droitSection.droits.includes(nomDroit)) {
      return next();
    } else {
      return next(createError.Unauthorized(message));
    }
  } catch (error) {
    error.message = "Erreur lors de la vérification des droits d'accès : " + error.message;
    return next(error);
  }
}

