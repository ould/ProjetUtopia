const createError = require('http-errors')
const Famille = require('../Models/Famille.model')
const { familleSchema } = require('../helpers/validation_schema')

module.exports = {
  save: async (req, res, next) => {
    try {

      const result = await familleSchema.validateAsync(req.body);
      result.creePar = req.payload.userId;

      const famille = new Famille(result);
      const savedFamille = await famille.save();
      const savedFamilleId = savedFamille._id;
      //TODO : type = famille 

      res.send({ savedFamilleId })
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await familleSchema.validateAsync(req.body)

      const doesExist = await Famille.findOne({ _id: result._id })
      if (!doesExist)
        throw createError.NotFound(`${result.id} not found`);

      result.modifiePar = req.payload.userId

      const filter = { _id: result._id };
      const updatedFamille = await Famille.findOneAndUpdate(filter, result, {
        returnOriginal: false
      });
      updatedFamille.id = updatedFamille.id;
      res.send(updatedFamille.id)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const id = req.params.id

      const doesExist = await Famille.findOne({ _id: id })
      if (!doesExist)
        throw createError.NotFound(`${id} not found`);
      doesExist.id = doesExist._id;
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  search: async (req, res, next) => {
    try {
      const nom = req.params.nomFamille

      const doesExist = await Famille.find({ "nomFamille": { $regex: nom } })
      if (!doesExist)
        throw createError.NotFound(`${nom} not found`);
      doesExist.id = doesExist._id;
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id

      //TODO : delete all personnes 

      const doesExist = await Famille.findOneAndDelete({ _id: id })
      res.send(doesExist._id)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  }

}
