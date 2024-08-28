const Antenne = require('../Models/Antenne.model');
const createError = require('http-errors')

module.exports = {
    getByNom: async (req, res, next) => {
        try {    
          const nom = req.params.nom
    
          const doesExist = await Antenne.findOne({ nom: nom })
          if (!doesExist)
            throw createError.NotFound(`${nom} not found`);
          res.send(doesExist)
    
        } catch (error) {
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
          next(error)
        }
      },
    
    
      getAll: async (req, res, next) => {
        try {
          const antennes = await Antenne.find();
          res.send(antennes)
        } catch (error) {
          if (error.isJoi === true) error.status = 422
          next(error)
        }
      },

      update: async (req, res, next) => {

    },

    delete: async (req, res, next) => {
        try {
            const id = req.params.id

            const doesExist = await Antenne.findOneAndDelete({ _id: id })
            res.send(doesExist.id)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
}
