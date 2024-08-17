const createError = require('http-errors')
const Beneficiaire = require('../Models/Beneficiaire.model')
const { beneficiaireSchema } = require('../helpers/validation_schema');
const UserController = require('./User.Controller');

module.exports = {
  save: async (req, res, next)  => {
    try {
      const beneficaireASauver = await beneficiaireSchema.validateAsync(req.body)
      const utilisateurReferent = await UserController.getCurrentUser(req, res, next);
      
      if (beneficaireASauver._id)
        throw createError.Conflict(`${beneficaireASauver._id} have already id`)
      
      beneficaireASauver.type = req.baseUrl.split('/')[2]
      beneficaireASauver.antenne = utilisateurReferent.antenneDefautId;
      beneficaireASauver.creePar = utilisateurReferent._id

      const nouveauBeneficiaire = new Beneficiaire(beneficaireASauver)
      const savedBeneficiaire = await nouveauBeneficiaire.save()
      const savedBeneficiaireId = savedBeneficiaire._id

      res.send({savedBeneficiaireId})
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const beneficaireRequete = await beneficiaireSchema.validateAsync(req.body);
      const utilisateurReferent = await UserController.getCurrentUser(req, res, next);


      const filter = { _id: beneficaireRequete._id, antenne:utilisateurReferent.antenneDefautId};
      const beneficiaireExistant = await Beneficiaire.findOne(filter)
      if (!beneficiaireExistant)
        throw createError.NotFound(`${beneficaireRequete._id} not found`);

      beneficaireRequete.modifiePar = utilisateurReferent._id

      const updatedBeneficiaire = await Beneficiaire.findOneAndUpdate(filter, beneficaireRequete, {
        returnOriginal: false
      });
      res.send(updatedBeneficiaire._id)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const id = req.params.id
      const utilisateurReferent = await UserController.getCurrentUser(req, res, next);

      const utilisateurExistant = await Beneficiaire.findOne({ _id: id, antenne: utilisateurReferent.antenneDefautId })
      if (!utilisateurExistant)
        throw createError.NotFound(`${id} not found`);
      res.send(utilisateurExistant)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id
      const utilisateurReferent = await UserController.getCurrentUser(req, res, next);

      const utilisateurSupprime = await Beneficiaire.findOneAndDelete({ _id: id, antenne:utilisateurReferent.antenneDefautId })
      res.send(utilisateurSupprime.id)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  }
}
