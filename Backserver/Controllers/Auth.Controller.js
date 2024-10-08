const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')
const { addDateHours } = require('../helpers/date')

module.exports = {
  register: async (req, res, next) => {
    try {
      const nouvelUtilisateur = await authSchema.validateAsync(req.body);

      const utilisateurExiste = await User.findOne({ email: nouvelUtilisateur.email });
      if (utilisateurExiste)
        throw createError.Conflict(`${nouvelUtilisateur.email} is already been registered`);

      nouvelUtilisateur.profilId = "" // par securité on emepche la création d'un utilisateur avec directement un profil
      nouvelUtilisateur.creePar = "self"; //Créé par lui meme 

      const user = new User(nouvelUtilisateur);
      await user.save();
      res.send(true)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const utilisateurRequete = await authSchema.validateAsync(req.body);
      const utilisateur = await User.findOne({ email: utilisateurRequete.email });
      if (!utilisateur) {
        throw createError.Unauthorized('Email ou mot de passe invalide')
      }

      const isMatch = await utilisateur.isValidPassword(utilisateurRequete.password);
      if (!isMatch) {
        throw createError.Unauthorized('Email ou mot de passe invalide');
      }

      const accessToken = await signAccessToken(utilisateur);
      const expiresAt = addDateHours(20);
      res.send({ accessToken, utilisateur, expiresAt })
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Invalid'));
      next(error);
    }
  }
}
