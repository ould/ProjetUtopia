const createError = require('http-errors')
const { droitSchema } = require('../helpers/validation_schema')
const Droit = require('../Models/Droit.model')

module.exports = {
    save: async (req, res, next) => {
        try {
            const result = req.body
            const doesExist = await Droit.findOne({ nom: result.nom })
            if (doesExist)
                throw createError.Conflict(`${result.nom} already exist`)

            result.creePar = req.payload.userId

            const droit = new Droit(result)
            const savedDroit = await droit.save()
            savedDroit._id = ""
            res.send(savedDroit)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
    
    get: async (req, res, next) => {
        try {

            const id = req.params.id

            const doesExist = await Droit.findOne({ _id: id })
            if (!doesExist)
                throw createError.NotFound(`${id} not found`);
            doesExist._id = ""
            res.send(doesExist)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    getAll: async (req, res, next) => {
        try {

            const userGroupes = req.payload.groupes
            //TODO verifier admin 
            const droits = await Droit.find();
            droits.forEach(element => {
                element._id = ""
            });
            res.send(droits)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = req.params.id

            const doesExist = await Droit.findOneAndDelete({ _id: id })
            res.send(doesExist.nom)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
}
