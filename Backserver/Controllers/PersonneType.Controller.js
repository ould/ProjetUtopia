const createError = require('http-errors')
const { personneTypeSchema } = require('../helpers/validation_schema')
const PersonneType = require('../Models/PersonneType.model')

module.exports = {
  save: async (req, res, next) => {
    try {
      const result = req.body

      const doesExist = await PersonneType.findOne({ nom: result.nom })
      if (doesExist)
        throw createError.Conflict(`${result.nom} already exist`)

      result.creePar = req.payload.userId

      const personneType = new PersonneType(result)
      const savedType = await personneType.save()
      res.send( savedType)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await personneTypeSchema.validateAsync(req.body)

      const doesExist = await PersonneType.findOne({ nom: result.nom })
      if (!doesExist)
        throw createError.NotFound(`${result.id} not found`);

      result.modifiePar = req.payload.userId

      const filter = { nom: result.nom };
      const updatedType = await PersonneType.findOneAndUpdate(filter, result, {
        returnOriginal: false
      });
      res.send(updatedType)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {

      const id = req.params.id

      const doesExist = await PersonneType.findOne({ _id: id })
      if (!doesExist)
        throw createError.NotFound(`${id} not found`);
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  getFromName: async (req, res, next) => {
    try {

      const nom = req.params.nom

      const doesExist = await PersonneType.findOne({ nom: nom })
      if (!doesExist)
        throw createError.NotFound(`${nom} not found`);
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  getAll: async (req, res, next) => {
    try {
      const user = req
      //TODO verifier admin 
      const types = await PersonneType.find();
      res.send(types)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.nom
        //TODO : verif admin
      const doesExist = await Groupe.findOneAndDelete({ nom: nom })
      res.send(doesExist.nom)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

}
