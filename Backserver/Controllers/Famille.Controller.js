const createError = require('http-errors')
const Famille = require('../Models/Famille.model')
const { familleSchema } = require('../helpers/validation_schema')
const client = require('../helpers/init_redis')

module.exports = {
  save: async (req, res, next) => {
    try {
      
      const result = await familleSchema.validateAsync(req.body)

      // const doesExist = await Famille.findOne({ id: result.id })
      // if (doesExist)
      //   throw createError.Conflict(`${result.email} is already been registered`)

      const famille = new Famille(result)
      const savedFamille = await famille.save()
      const savedFamilleId = savedFamille.familleId

      res.send({ savedFamilleId })
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await familleSchema.validateAsync(req.body)

      const doesExist = await Famille.findOne({ familleId: result.familleId })
      if (!doesExist)
      throw createError.NotFound(`${result.familleId} not found`);
    
    const filter = { familleId: result.familleId };
    const updatedFamille = await Famille.findOneAndUpdate(filter, result, {
      returnOriginal: false
    });
    res.send(updatedFamille)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const id = req.params.id
      
      const doesExist = await Famille.findOne({ familleId: id })
      if (!doesExist)
      throw createError.NotFound(`${id} not found`);
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  search: async (req, res, next) => {
    try {
      const nom = req.params.nomFamille
      
      const doesExist = await Famille.find({"nomFamille": {$regex : nom}})
      if (!doesExist)
      throw createError.NotFound(`${id} not found`);
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id
      
      const doesExist = await Famille.findOneAndDelete({ familleId: id })
      res.send(doesExist)
      
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  }

}
