const createError = require('http-errors')
const Famille = require('../Models/Famille.model')
const { familleSchema } = require('../helpers/validation_schema');
const BeneficiaireController = require('./Beneficiaire.Controller');
const UserController = require('./User.Controller');

module.exports = {
  get: async (req, res, next) => {
    try {
      const id = req.params.id
      const userReferent = await UserController.getCurrentUser(req, res, next)

      const familleExistante = await Famille.findOne({ _id: id, antenne: userReferent.antenneDefautId })
      if (!familleExistante)
        throw createError.NotFound(`${id} not found`);
      res.send(familleExistante)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  save: async (req, res, next) => {
    try {

      const familleASauver = await familleSchema.validateAsync(req.body);

      const userId = req.payload.userId; 
      const userReferent = await UserController.getCurrentUser(req, res, next)

      familleASauver.antenne = userReferent.antenneDefautId;
      familleASauver.creePar = userId;
      const nouvelleFamille = new Famille(familleASauver);
      const savedFamille = await nouvelleFamille.save();
      const savedFamilleId = savedFamille._id;

      res.send({ savedFamilleId })
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const familleRequete = await familleSchema.validateAsync(req.body)
      const userReferent = await UserController.getCurrentUser(req, res, next)

      const filter = { _id: familleRequete._id, antenne: userReferent.antenneDefautId  };
      const FamilleExistante = await Famille.findOne(filter)
      if (!FamilleExistante)
        throw createError.NotFound(`${familleRequete.id} not found`);

      familleRequete.modifiePar = req.payload.userId

      const updatedFamille = await Famille.findOneAndUpdate(filter, familleRequete, {
        returnOriginal: false
      });
      updatedFamille.id = updatedFamille.id;
      res.send(updatedFamille.id)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },


  search: async (req, res, next) => {
    try {
      const nom = req.params.nomFamille
      const userReferent = await UserController.getCurrentUser(req, res, next)

      const listeFamilles = await Famille.find({ "nomFamille": { $regex: nom }, "antenne": userReferent.antenneDefautId })
      if (!listeFamilles)
        throw createError.NotFound(`${nom} not found`);
      res.send(listeFamilles)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id
      const userReferent =  await UserController.getCurrentUser(req, res, next);

      const familleExistante = await Famille.findOneAndDelete({ _id: id, antenne: userReferent.antenneDefautId });
      res.send(familleExistante._id)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  }
}

