const createError = require('http-errors');
const UserController = require('./User.Controller');
const Referentiel = require('../Models/Referentiel.model');
const { referentielSchema } = require('../helpers/validation_schema');

module.exports = {

    getById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { _id: id, antenneId: userReferent.antenneDefautId }
            const referentiel = await Referentiel.findOne(filtre);
            if (!referentiel)
                throw createError.NotFound(`${id} not found`);
            res.send(referentiel)
        } catch (error) {
            next(error)
        }
    },
//Acces seulement a travers les sections; pour les referentiels specifiques à ces sections 
    getByNom: async (req, res, next) => {
        try {
            const nom = req.params.nom;
            const sectionDemandee = req.baseUrl.split('/')[2];
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { entitee: sectionDemandee, nom: nom, antenneId: userReferent.antenneDefautId }

            const referentiel = await Referentiel.findOne(filtre);
            if (!referentiel)
                throw createError.NotFound(`${nom} not found`);
            res.send(referentiel.donnees)
        } catch (error) {
            next(error)
        }
    },
//Pour les referentiels globaux comme les pays etc => entitee nulle
    getGlobalByNom: async (req, res, next) => {
        try {
            const nom = req.params.nom;
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { entitee: null, nom: nom, antenneId: userReferent.antenneDefautId }

            const referentiel = await Referentiel.findOne(filtre);
            if (!referentiel)
                throw createError.NotFound(`${nom} not found`);
            res.send(referentiel.donnees)
        } catch (error) {
            next(error)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const referentiels = await Referentiel.find();
            if (!referentiels)
                throw createError.NotFound(`liste not found`);
            res.send(referentiels)
        } catch (error) {
            next(error)
        }
    },

    save: async (req, res, next) => {
        try {
            const nom = req.body.nom;
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const nouveauReferentiel= new Referentiel({nom:nom,donnees:[],antenneId:userReferent.antenneDefautId,creePar:userReferent._id});
            const savedHRef = await nouveauReferentiel.save();
            res.send(savedHRef)
        } catch (error) {
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const referentielRequete = await referentielSchema.validateAsync(req.body, { allowUnknown: true });
            const filtre = { nom: referentielRequete.nom }

            const doesExist = await Referentiel.findOne(filtre)
            if (!doesExist)
                throw createError.NotFound(`${referentielRequete.nom} not found`);

            referentielRequete.modifiePar = req.payload.userId
            const updatedRef = await Referentiel.findOneAndUpdate(filtre, referentielRequete, {
                returnOriginal: false
            });
            res.send(updatedRef)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const nom = req.params.nom
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { nom: nom, antenneId: userReferent.antenneDefautId }

            const doesExist = await Referentiel.findOneAndDelete(filtre)
            res.send(doesExist.nom)

        } catch (error) {
            next(error)
        }
    }
}