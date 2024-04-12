const Antenne = require('../Models/Antenne.model');

module.exports = {
    get: async (req, res, next) => {
        try {
    
          const nom = req.params.nom
    
          const doesExist = await Antenne.findOne({ nom: nom })
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
          const antennes = await Antenne.find();
          res.send(antennes)
        } catch (error) {
          if (error.isJoi === true) error.status = 422
          next(error)
        }
      }
}
