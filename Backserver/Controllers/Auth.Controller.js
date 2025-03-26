const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')
const { addDateHours } = require('../helpers/date')
const { logErreur, logInfo } = require('../helpers/logs');
const { generationMotAleatoire } = require('../helpers/methodes');
const moment = require('moment');
const { envoyerMail } = require('../helpers/email');
const { LienTemp, OperationEnum } = require('../Models/LienTemporaire.model')

module.exports = {
  register: async (req, res, next) => {
    try {
      const nouvelUtilisateur = await authSchema.validateAsync(req.body);

      const utilisateurExiste = await User.findOne({ email: nouvelUtilisateur.email });
      if (utilisateurExiste){
        logErreur("Auth register","Utilisateur deja existant " + utilisateurExiste.email, "register");
        throw createError.Conflict(`${nouvelUtilisateur.email} deja existant`);
      }

      nouvelUtilisateur.profilId = "" // par securité on emepche la création d'un utilisateur avec directement un profil
      nouvelUtilisateur.creePar = "self"; //Créé par lui meme 

      const user = new User(nouvelUtilisateur);
      await user.save();
      res.send(true);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      logErreur("Auth register",error, "register")
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const tentativesMaximum = 5;
      const utilisateurRequete = await authSchema.validateAsync(req.body);
      const utilisateur = await User.findOne({ email: utilisateurRequete.email });
      if (!utilisateur) {
        logErreur("Auth login","Erreur authentification email: " + utilisateurRequete?.email , "authentification")
        throw createError.Unauthorized('Email ou mot de passe invalide')
      }

      if(!utilisateur.tentativeConnexion) utilisateur.tentativeConnexion = 0
      
      if(utilisateur.tentativeConnexion > tentativesMaximum){
        logErreur("Auth login","Erreur authentification - compte bloqué suite à plusieurs tentatives de connexion: " + utilisateurRequete?.email , "authentification");
        throw createError.Unauthorized('Compte bloqué');
      }

      const isMatch = await utilisateur.isValidPassword(utilisateurRequete.password);
      if (!isMatch) {
        logErreur("Auth login","Erreur authentification mdp: " + utilisateurRequete?.email , "authentification")
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
      logErreur("Auth login",error, "authentification")
      if (error.isJoi === true)
        return next(createError.BadRequest('Email ou mot de passe invalide'));
      next(error);
    }
  },
  demandeReinitialiseMotDePasseByEmail: async (req, res, next) => {
    try {
        const idUser = req.payload?.userId ?? "0"
        const emailUserAModifier = req.body.email
        const utilisateurExistant = await User.findOne({ email: emailUserAModifier })
        if (!utilisateurExistant) {
            logInfo("Mauvaise réinitialisation de mot de passe pour " + emailUserAModifier)  
            return res.send(true) // Pas de message d'erreur pour eviter de donner des infos sur les utilisateurs
        }
        logInfo("Demande de réinitialisation de mot de passe pour " + utilisateurExistant.email)  

        let hashTemporaire = generationMotAleatoire(25)
        let lien = process.env.URL_FRONT+ "/reinitialisation-mot-de-passe/" + hashTemporaire
        
        let dateExpiration = moment(Date.now()).add(30, 'm').toDate();

        let lienTemporaire = new LienTemp({ dateExpiration: dateExpiration, hash: hashTemporaire, cibleId: utilisateurExistant._id, creePar: idUser , operation : OperationEnum.REINITIALISATION_MDP})
        lienTemporaire.save()

        envoyerMail(utilisateurExistant.email, "Réinitialisation de mot de passe", "Votre demande de réinitialisation de mot de passe est prise en compte. Veuillez cliquer sur le lien suivant pour le modifier : " + lien)

        res.send(true)
    } catch (error) {
        logErreur("Utilisateur reinitialiseMotDePasse",error, req?.params?.id)
        next(error)
    }
},
  accepteReinitialisationMotDePasse: async (req, res, next) => {
    try {
        const hash = req.body.hash
        const nouveauMdp = req.body.mdp
        const lienTemporaire = await LienTemp.findOne({ hash: hash })
        if(!lienTemporaire) {
          logInfo("Réinitialisation de mot de passe non valide car sans lien " + hash)  
          return res.send(false)
        }
        const lienAExpire = lienTemporaire?.dateExpiration < Date.now()
        if (!lienTemporaire || lienTemporaire.operation !== OperationEnum.REINITIALISATION_MDP || lienAExpire ) {
          logInfo("Réinitialisation de mot de passe non valide " + lienAExpire.toString() + " " + lienTemporaire?.operation.toString())  
          return res.send(false)
        }
        const utilisateurExistant = await User.findOne({ _id: lienTemporaire.cibleId })
        if (!utilisateurExistant) {
          logInfo("Réinitialisation de mot de passe non valide user " + lienTemporaire.cibleId)
            return res.send(false)
        }
        
        await User.updateOne(
          {  _id: lienTemporaire.cibleId },
          {  password: nouveauMdp,
            modifiePar: lienTemporaire.creePar
          } )
        await lienTemporaire.delete()

        logInfo("Réinitialisation de mot de passe effectuée pour " + utilisateurExistant.email)
        res.send(true)
    } catch (error) {
        logErreur("Utilisateur reinitialiseMotDePasse",error, req?.params?.id)
        next(error)
    }
},
}
