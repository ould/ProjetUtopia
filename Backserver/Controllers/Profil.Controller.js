const createError = require('http-errors')
const { profilSchema } = require('../helpers/validation_schema')
const Profil = require('../Models/Profil.model')

module.exports = {
    save: async (req, res, next) => {
        try {
            const result = await profilSchema.validateAsync(req.body)
            const doesExist = await Profil.findOne({ nom: result.nom })
            if (doesExist)
                throw createError.Conflict(`${result.nom} already exist`)

            result.creePar = req.payload.userId

            const newProfil = new Profil(result)
            const savedProfil = await newProfil.save()
            res.send(savedProfil)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const nouveauProfil = await profilSchema.validateAsync(req.body)

            const profilExistant = await Profil.findOne({ nom: nouveauProfil.nom })
            if (!profilExistant)
                throw createError.NotFound(`${nouveauProfil.nom} not found`);

            nouveauProfil.modifiePar = req.payload.userId

            const filter = { nom: nouveauProfil.nom };
            const updatedProfil = await Profil.findOneAndUpdate(filter, nouveauProfil, {
                returnOriginal: false
            });
            res.send(updatedProfil)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    get: async (req, res, next) => {
        try {
            const id = req.params.id
            const profilExistant = await Profil.findOne({ _id: id })
            if (!profilExistant)
                throw createError.NotFound(`${id} not found`);
            profilExistant._id = ""
            res.send(profilExistant)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const profils = await Profil.find();
            res.send(profils)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = req.params.id
            const ancienProfil = await Groupe.findOneAndDelete({ _id: id })
            res.send(ancienProfil.nom)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
}
