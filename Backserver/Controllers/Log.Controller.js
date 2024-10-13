const createError = require('http-errors')
const { logSchema } = require('../helpers/validation_schema');
const Log = require('../Models/Log.model');
const { logErreur, logInfo } = require('../helpers/logs');

module.exports = {

    getAll: async (req, res, next) => {
        try {
            const logs = await Log.find();
            res.send(logs)  
        } catch (error) {
            console.log("Probleme de log getAll: "+ error);
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
    getParPage: async (req, res, next) => {
        try {
            // Récupérer les paramètres de pagination à partir de la requête
            const page = parseInt(req.query.page) || 1; // Par défaut page 1
            const limit = parseInt(req.query.limit) || 10; // Par défaut 10 éléments par page

            // Calculer le nombre d'éléments à sauter en fonction de la page actuelle
            const skip = (page - 1) * limit;

            // Compter le nombre total d'éléments dans la collection 
            const total = await Log.countDocuments();

            // Récupérer les éléments paginés avec skip() et limit()
            const logs = await Log.find()
                .sort({ date: -1 }) // Tri par date décroissante
                .skip(skip)
                .limit(limit);

            res.send({total, logs})

        } catch (error) {
            logErreur(error, req?.params?.id)
            next(error)
        }
    },

    save: async (req, res, next) => {
        try {
            const result = await logSchema.validateAsync(req.body)
            result.utilisateurId = req.payload.userId;
            result.application = "Front";
            result.date = Date.now();

            const log = new Log(result)
            await log.save()

            res.send(true)
        } catch (error) {
            console.log("Probleme de log save: "+ error);
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
            console.log("Probleme de log getByDate: "+ error);
            if (error.isJoi === true) error.status = 422;
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
            onsole.log("Probleme de log getByUser: "+ error);
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
}
