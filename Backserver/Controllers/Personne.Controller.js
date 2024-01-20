const createError = require('http-errors')
const Personne = require('../Models/Personne.model')
const { personneSchema } = require('../helpers/validation_schema')
const client = require('../helpers/init_redis')

module.exports = {
  save: async (req, res, next) => {
    try {
      const result = await personneSchema.validateAsync(req.body)
      result.creePar = req.payload.userId

      if (result._id)
        throw createError.Conflict(`${result._id} is already id`)

      const personne = new Personne(result)
      const savedPersonne = await personne.save()
      const savefPersonneId = savedPersonne._id

      res.send(savefPersonneId)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await personneSchema.validateAsync(req.body)

      const doesExist = await Personne.findOne({ _id: result.id })
      if (!doesExist)
        throw createError.NotFound(`${result.id} not found`);

      result.modifiePar = req.payload.userId

      const filter = { _id: result.id };
      const updatedPersonne = await Personne.findOneAndUpdate(filter, result, {
        returnOriginal: false
      });
      res.send(updatedPersonne.id)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const id = req.params.id

      const doesExist = await Personne.findOne({ _id: id })
      if (!doesExist)
        throw createError.NotFound(`${result} not found`);
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id

      const doesExist = await Personne.findOneAndDelete({ _id: id })
      res.send(doesExist.id)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  }
}
