const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')
const { addDateHours } = require('../helpers/date')
const { logErreur, logInfo } = require('../helpers/logs');

module.exports = {
  register: async (req, res, next) => {
    try {
      const nouvelUtilisateur = await authSchema.validateAsync(req.body);

      const utilisateurExiste = await User.findOne({ email: nouvelUtilisateur.email });
      if (utilisateurExiste){
        logErreur("Utilisateur deja existant " + utilisateurExiste.email, "register");
        throw createError.Conflict(`${nouvelUtilisateur.email} deja existant`);
      }

      nouvelUtilisateur.profilId = "" // par securité on emepche la création d'un utilisateur avec directement un profil
      nouvelUtilisateur.creePar = "self"; //Créé par lui meme 

      const user = new User(nouvelUtilisateur);
      await user.save();
      res.send(true);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      logErreur(error, "register")
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const tentativesMaximum = 5;
      const utilisateurRequete = await authSchema.validateAsync(req.body);
      const utilisateur = await User.findOne({ email: utilisateurRequete.email });
      if (!utilisateur) {
        logErreur("Erreur authentification email: " + utilisateurRequete?.email , "authentification")
        throw createError.Unauthorized('Email ou mot de passe invalide')
      }

      if(!utilisateur.tentativeConnexion) utilisateur.tentativeConnexion = 0
      
      if(utilisateur.tentativeConnexion > tentativesMaximum){
        logErreur("Erreur authentification - compte bloqué suite à plusieurs tentatives de connexion: " + utilisateurRequete?.email , "authentification");
        throw createError.Unauthorized('Compte bloqué');
      }

      const isMatch = await utilisateur.isValidPassword(utilisateurRequete.password);
      if (!isMatch) {
        logErreur("Erreur authentification mdp: " + utilisateurRequete?.email , "authentification")
        utilisateur.tentativeConnexion = utilisateur.tentativeConnexion +1;
        await User.findOneAndUpdate({ email: utilisateurRequete.email }, utilisateur)
        throw createError.Unauthorized('Email ou mot de passe invalide');
      }

      utilisateur.tentativeConnexion = 0;
      await User.findOneAndUpdate({ email: utilisateurRequete.email }, utilisateur)

      const accessToken = await signAccessToken(utilisateur);
      const expiresAt = addDateHours(20);
      res.send({ accessToken, utilisateur, expiresAt })
    } catch (error) {
      logErreur(error, "authentification")
      if (error.isJoi === true)
        return next(createError.BadRequest('Email ou mot de passe invalide'));
      next(error);
    }
  }
}
