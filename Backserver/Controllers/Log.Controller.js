const createError = require('http-errors')
const { logSchema } = require('../helpers/validation_schema');
const Log = require('../Models/Log.model');

module.exports = {

    getAll: async (req, res, next) => {
        try {
            const logs = await Log.find();
            res.send(logs)  
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    save: async (req, res, next) => {
        try {
            const result = await logSchema.validateAsync(req.body)
            result.creePar = req.payload.userId

            const log = new Log(result)
            await log.save()

            res.send(true)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
    getByDate: async (req, res, next) => {
        try {
            const date = req.params.date

            const doesExist = await logSchema.find({ dateCreation: date })
            if (!doesExist) {
                throw createError.NotFound(`${date} not found`);
            }
            res.send(doesExist)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
    getByUser: async (req, res, next) => {
        try {
            const idUser = req.params.idUser

            const doesExist = await logSchema.find({ creePar: idUser })
            if (!doesExist) {
                throw createError.NotFound(`${idUser} not found`);
            }
            res.send(doesExist)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
}
