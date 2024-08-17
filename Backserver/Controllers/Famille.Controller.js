const createError = require('http-errors')
const Famille = require('../Models/Famille.model')
const { familleSchema } = require('../helpers/validation_schema');
const User = require('../Models/User.model');

async function getUserRequete(req, res, next){
  try {
    const userId = req.payload.userId;
    console.log("user "+ userId)
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

      const result = await familleSchema.validateAsync(req.body);
      const userId = req.payload.userId;

      const userReferent = await module.exports.getUserRequete(req, res, next)
      console.log("referent ")
      console.log(userReferent)

      result.antenne = userReferent.antenneDefautId;
      result.creePar = userId;
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
      const userReferent = await module.exports.getUserRequete(req, res, next)

      const doesExist = await Famille.findOne({ _id: result._id, antenne:userReferent.antenneDefautId })
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
      const userReferent = await module.exports.getUserRequete(req, res, next)

      const doesExist = await Famille.findOne({ _id: id , antenne:userReferent.antenneDefautId})
      if (!doesExist)
        throw createError.NotFound(`${id} not found`);
      doesExist.id = doesExist._id;
      doesExist.test = ""
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  search: async (req, res, next) => {
    try {
      const nom = req.params.nomFamille

      const userReferent = await module.exports.getUserRequete(req, res, next) //TODO voir pour mettre la variante avec filtre sur toutes les antennes 

      const doesExist = await Famille.find({ "nomFamille": { $regex: nom }, "antenne": userReferent.antenneDefautId})
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
      const userReferent = await module.exports.getUserRequete(req, res, next)
      //TODO : delete all personnes 

      const doesExist = await Famille.findOneAndDelete({ _id: id , antenne:userReferent.antenneDefautId})
      res.send(doesExist._id)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  getUserRequete
}

