const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')
const { addDateHours } = require('../helpers/date')
const { logErreur, logInfo } = require('../helpers/logs');
const { envoyerMail } = require('../helpers/email');
const { OperationEnum } = require('../Models/LienTemporaire.model')
const { GetLienTemporaireFront, CheckEtDeleteLienTemporaire } = require('../helpers/lienTemp')
const Profil = require('../Models/Profil.model')

module.exports = {
  register: async (req, res, next) => {
    try {
      const nouvelUtilisateur = await authSchema.validateAsync(req.body);

      const utilisateurExiste = await User.findOne({ email: nouvelUtilisateur.email });
      if (utilisateurExiste) {
        logErreur("Auth register", "Utilisateur deja existant " + utilisateurExiste.email, "register");
        throw createError.Conflict(`${nouvelUtilisateur.email} deja existant`);
      }

      const profilAccueil = await Profil.findOne({ nom: "accueil" });
      if (!profilAccueil?._id) {
        logErreur("Auth register", "Profil accueil non trouvé", "register");
        throw createError.InternalServerError("Erreur lors de la création de l'utilisateur, le profil accueil n'existe pas");
      }

      nouvelUtilisateur.profilId = profilAccueil._id // par securité on emepche la création d'un utilisateur avec directement un profil
      nouvelUtilisateur.creePar = "self"; //Créé par lui meme 
      nouvelUtilisateur.modifiePar = "self"; //Créé par lui meme
      nouvelUtilisateur.tentativeConnexion = 0; //Initialisation du nombre de tentatives de connexion

      const user = new User(nouvelUtilisateur);
      const utilisateurcree = await user.save();

      //Confirmation de l'email
      let lien = await GetLienTemporaireFront(OperationEnum.CONFIRMATION_EMAIL, utilisateurcree._id, utilisateurcree._id);
      
      const email = nouvelUtilisateur.email;
      envoyerMail(email, "Confirmation de l'email", "Votre compte est créé. Veuillez cliquer sur le lien suivant pour confirmer votre adresse mail : " + lien);

      res.send(true);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      logErreur("Auth register", error, "register")
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const tentativesMaximum = 5;
      const utilisateurRequete = await authSchema.validateAsync(req.body);
      const utilisateur = await User.findOne({ email: utilisateurRequete.email });
      if (!utilisateur) {
        logErreur("Auth login", "Erreur authentification email: " + utilisateurRequete?.email, "authentification")
        throw createError.Unauthorized('Email ou mot de passe invalide')
      }

      if (!utilisateur.tentativeConnexion) utilisateur.tentativeConnexion = 0

      if (utilisateur.tentativeConnexion > tentativesMaximum) {
        logErreur("Auth login", "Erreur authentification - compte bloqué suite à plusieurs tentatives de connexion: " + utilisateurRequete?.email, "authentification");
        throw createError.Unauthorized('Compte bloqué');
      }

      const isMatch = await utilisateur.isValidPassword(utilisateurRequete.password);
      if (!isMatch) {
        logErreur("Auth login", "Erreur authentification mdp: " + utilisateurRequete?.email, "authentification")
        let nbrTentative = utilisateur.tentativeConnexion + 1;
        await User.updateOne({ email: utilisateurRequete.email },
          { tentativeConnexion: nbrTentative })
        throw createError.Unauthorized('Email ou mot de passe invalide');
      }

      utilisateur.tentativeConnexion = 0;
      await User.updateOne({ email: utilisateurRequete.email },
        { tentativeConnexion: 0 })

      const accessToken = await signAccessToken(utilisateur);
      const expiresAt = addDateHours(20);
      res.send({ accessToken, utilisateur, expiresAt })
    } catch (error) {
      logErreur("Auth login", error, "authentification")
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

      let lien = await GetLienTemporaireFront(OperationEnum.REINITIALISATION_MDP, utilisateurExistant._id, idUser)

      envoyerMail(utilisateurExistant.email, "Réinitialisation de mot de passe", "Votre demande de réinitialisation de mot de passe est prise en compte. Veuillez cliquer sur le lien suivant pour le modifier : " + lien)

      res.send(true)
    } catch (error) {
      logErreur("Utilisateur reinitialiseMotDePasse", error, req?.params?.id)
      next(error)
    }
  },
  accepteReinitialisationMotDePasse: async (req, res, next) => {
    try {
      const hash = req.body.hash
      const nouveauMdp = req.body.mdp

      let userCibleId = await CheckEtDeleteLienTemporaire(hash, OperationEnum.REINITIALISATION_MDP)
      if (!userCibleId) {
        logInfo("Réinitialisation de mot de passe non valide " + userCibleId)
        return res.send(false)
      }
      const utilisateurExistant = await User.findOne({ _id: userCibleId })
      if (!utilisateurExistant) {
        logInfo("Réinitialisation de mot de passe non valide user " + userCibleId)
        return res.send(false)
      }

      await User.updateOne(
        { _id: userCibleId },
        {
          password: nouveauMdp,
          dateModification: Date.now()
        })

      logInfo("Réinitialisation de mot de passe effectuée pour " + utilisateurExistant.email)
      res.send(true)
    } catch (error) {
      logErreur("Utilisateur reinitialiseMotDePasse", error, req?.params?.id)
      next(error)
    }
  },
  confirmerEmail: async (req, res, next) => {
    try {
      const hash = req.body.hash
      let userCibleId = await CheckEtDeleteLienTemporaire(hash, OperationEnum.CONFIRMATION_EMAIL)
      if (!userCibleId) {
        logInfo("Confirmation de mail non valide " + userCibleId)
        return res.send(false)
      }
      const utilisateurExistant = await User.findOne({ _id: userCibleId })
      if (!utilisateurExistant) {
        logInfo("Confirmation de mail non valide user " + userCibleId)
        return res.send(false)
      }

      await User.updateOne(
        { _id: userCibleId },
        { emailValide: true })

      logInfo("Confirmation de mail effectuée pour " + utilisateurExistant.email)
      res.send(true)
    } catch (error) {
      logErreur("Utilisateur confirmerEmail", error, req?.params?.id)
      next(error)
    }
  }
}
