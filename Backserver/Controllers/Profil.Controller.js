const createError = require('http-errors')
const { profilSchema } = require('../helpers/validation_schema')
const Profil = require('../Models/Profil.model');
const { historique_ChercheChampsModifies } = require('../helpers/methodes');
const HistoriqueController = require('./Historique.Controller');
const { logErreur, logInfo } = require('../helpers/logs');

module.exports = {
    save: async (req, res, next) => {
        try {
            const nomNouveauProfil = req.body.nom;
            const utilisateurId = req.payload.userId
            const doesExist = await Profil.findOne({ nom: nomNouveauProfil });
            if (doesExist)
                throw createError.Conflict(`${result.nom} already exist`);

            let nouveauProfil = { nom: nomNouveauProfil, creePar: utilisateurId, tableauDroits: [] }

            const newProfil = new Profil(nouveauProfil);
            const savedProfil = await newProfil.save();
            res.send(savedProfil);
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Profil save",error, req?.params?.id)
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const nouveauProfil = await profilSchema.validateAsync(req.body, { allowUnknown: true }); //TODO : verifier si une seule occurence d'un droit 

            const profilExistant = await Profil.findOne({ nom: nouveauProfil.nom });
            if (!profilExistant)
                throw createError.NotFound(`${nouveauProfil.nom} not found`);

            nouveauProfil.modifiePar = req.payload.userId;
            nouveauProfil.dateModification = Date.now();

            const filter = { nom: nouveauProfil.nom };
            const updatedProfil = await Profil.findOneAndUpdate(filter, nouveauProfil, {
                returnOriginal: false
            });

            //Historisation des modifications
            const champsModifies = historique_ChercheChampsModifies(profilExistant, nouveauProfil);
            HistoriqueController.save("Profil", champsModifies, req.payload.userId);

            res.send(updatedProfil);
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Profil update",error, req?.params?.id)
            next(error)
        }
    },

    get: async (req, res, next) => {
        try {
            const id = req.params.id;
            const profilExistant = await Profil.findOne({ _id: id });
            if (!profilExistant)
                throw createError.NotFound(`${id} not found`);
            profilExistant._id = "";
            res.send(profilExistant);

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Profil get",error, req?.params?.id)
            next(error)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const profils = await Profil.find();
            res.send(profils);
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Profil getAll",error, req?.params?.id)
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = req.params.id;
            const ancienProfil = await Profil.findOneAndDelete({ _id: id });
            res.send(ancienProfil.nom);

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Profil delete",error, req?.params?.id)
            next(error)
        }
    }
}
