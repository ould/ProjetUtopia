const createError = require('http-errors');
const UserController = require('./User.Controller');
const Historique = require('../Models/Historique.model');
const { historiqueSchema } = require('../helpers/validation_schema');

module.exports = {

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

    update: async (req, res, next) => {
        try {
            const historiqueRequete = await historiqueSchema.validateAsync(req.body);
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const sectionDemandee = req.baseUrl.split('/')[2];
            const filtre = { _id: historiqueRequete._id, antenneId: userReferent.antenneDefautId }

            const doesExist = await Historique.findOne(filtre)
            if (!doesExist)
                throw createError.NotFound(`${historiqueRequete._id} not found`);

            historiqueRequete.entitee = sectionDemandee;
            historiqueRequete.modifiePar = req.payload.userId
            const updatedHisto = await Historique.findOneAndUpdate(filtre, historiqueRequete, {
                returnOriginal: false
            });
            res.send(updatedHisto)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
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