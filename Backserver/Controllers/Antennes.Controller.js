const Antenne = require('../Models/Antenne.model');
const createError = require('http-errors')
const { logErreur, logInfo } = require('../helpers/logs');

module.exports = {
    getByNom: async (req, res, next) => {
        try {    
          const nom = req.params.nom
    
          const doesExist = await Antenne.findOne({ nom: nom })
          if (!doesExist)
            throw createError.NotFound(`${nom} not found`);
          res.send(doesExist)
    
        } catch (error) {
          logErreur("Antenne getByNom",error, req?.params?.id)
          next(error)
        }
      },

      getById: async (req, res, next) => {
        try {    
          const id = req.params.id
    
          const doesExist = await Antenne.findOne({ _id: id  })
          if (!doesExist)
            throw createError.NotFound(`${id} not found`);
          res.send(doesExist)
    
        } catch (error) {
          logErreur("Antenne getById",error, req?.params?.id)
          next(error)
        }
      },
    
    
      getAll: async (req, res, next) => {
        try {
          const antennes = await Antenne.find();
          res.send(antennes)
        } catch (error) {
          if (error.isJoi === true) error.status = 422
          logErreur("Antenne getAll",error, req?.params?.id)
          next(error)
        }
      },

    delete: async (req, res, next) => {
        try {
            const id = req.params.id

            const doesExist = await Antenne.findOneAndDelete({ _id: id })
            res.send(doesExist.id)

        } catch (error) {
          logErreur("Antenne delete",error, req?.params?.id)
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
}
