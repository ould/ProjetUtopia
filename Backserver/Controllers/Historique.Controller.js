const createError = require('http-errors');
const UserController = require('./User.Controller');
const Historique = require('../Models/Historique.model');
const { historiqueSchema } = require('../helpers/validation_schema');

module.exports = {

    getAll: async (req, res, next) => {
        try {
            const historique = await Historique.find();
            res.send(historique)
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { _id: id, antenneId: userReferent.antenneDefautId }
            const historique = await Historique.findOne(filtre);
            if (!historique)
                throw createError.NotFound(`${id} not found`);
            res.send(historique)
        } catch (error) {
            next(error)
        }
    },

    getByEntiteeId: async (req, res, next) => {
        try {
            const entiteeId = req.params.id;
            const sectionDemandee = req.baseUrl.split('/')[2];
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { entitee: sectionDemandee, entiteeId: entiteeId, antenneId: userReferent.antenneDefautId }

            const historique = await Historique.findOne(filtre);
            if (!historique)
                throw createError.NotFound(`${entiteeId} not found`);
            res.send(historique)

        } catch (error) {
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

            // Compter le nombre total d'éléments dans la collection Historique
            const total = await Historique.countDocuments();

            // Récupérer les éléments paginés avec skip() et limit()
            const historiques = await Historique.find()
                .sort({ date: -1 }) // Tri par date décroissante
                .skip(skip)
                .limit(limit);

            res.send({total, historiques})

        } catch (error) {
            next(error)
        }
    },

    save: async (section, listeChamps, userId) => {
        try {

            Object(listeChamps).forEach(async item => {
                item.entitee = section;
                item.utilisateurId = userId;
                item.date = Date.now();
                const nouveauHistorique = new Historique(item);
                await nouveauHistorique.save();
            });
            return true
        } catch (error) {
            return false
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = req.params.id
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { _id: id, antenneId: userReferent.antenneDefautId }

            const doesExist = await Historique.findOneAndDelete(filtre)
            res.send(doesExist._id)

        } catch (error) {
            next(error)
        }
    }
}