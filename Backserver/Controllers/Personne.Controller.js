const createError = require('http-errors')
const Personne = require('../Models/Personne.model')
const { personneSchema } = require('../helpers/validation_schema');
const User = require('../Models/User.model');

async function getUserRequete(req, res, next){
  try {
    const userId = req.payload.userId;
    const userReferent = await User.findOne({ _id: userId })
    if (!userReferent) {
      throw createError.NotFound(`getUserRequete user not found`);
    }

    return userReferent

  } catch (error) {
    return next(createError.InternalServerError("Famille getUserRequete"))
  }
}

module.exports = {
  save: async (req, res, next) => {
    try {
      const result = await personneSchema.validateAsync(req.body)
      
      if (result._id)
        throw createError.Conflict(`${result._id} have already id`)
      
      const userReferent = await module.exports.getUserRequete(req, res, next)
      result.antenne = userReferent.antenneDefaut;
      result.creePar = req.payload.userId

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
      const userReferent = await module.exports.getUserRequete(req, res, next)


      const doesExist = await Personne.findOne({ _id: result.id, antenne:userReferent.antenneDefaut })
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
      const userReferent = await module.exports.getUserRequete(req, res, next)

      const doesExist = await Personne.findOne({ _id: id, antenne: userReferent.antenneDefaut })
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
      const userReferent = await module.exports.getUserRequete(req, res, next)

      const doesExist = await Personne.findOneAndDelete({ _id: id, antenne:userReferent.antenneDefaut })
      res.send(doesExist.id)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  getUserRequete
}
