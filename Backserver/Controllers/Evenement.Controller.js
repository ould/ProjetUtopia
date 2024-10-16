const createError = require('http-errors');
const Evenement = require('../Models/Evenement.model');
const { evenementSchema } = require('../helpers/validation_schema');
const UserController = require('./User.Controller');
const { logErreur, logInfo } = require('../helpers/logs');

module.exports = {

    getById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { _id: id, antenneId: userReferent.antenneDefautId }
            const evenement = await Evenement.findOne(filtre);
            if (!evenement)
                throw createError.NotFound(`${id} not found`);
            res.send(evenement)

        } catch (error) {
            logErreur("Evenement getById",error, req?.params?.id)
            next(error)
        }
    },

    getByEntiteeId: async (req, res, next) => {
        try {
            const entiteeId = req.params.id;
            const sectionDemandee = req.baseUrl.split('/')[2];
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { entitee: sectionDemandee, entiteeId: entiteeId, antenneId: userReferent.antenneDefautId }

            const evenement = await Evenement.findOne(filtre);
            if (!evenement)
                throw createError.NotFound(`${id} not found`);
            res.send(evenement)

        } catch (error) {
            logErreur("Evenement getByEntiteeId",error, req?.params?.id)
            next(error)
        }
    },

    save: async (req, res, next) => {
        try {
            const evenementRequete = await evenementSchema.validateAsync(req.body);
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const sectionDemandee = req.baseUrl.split('/')[2];

            evenementRequete.entitee = sectionDemandee;
            evenementRequete.creePar = userReferent._id;
            const nouveauEvenement = new Evenement(evenementRequete);
            const savedEvent = await nouveauEvenement.save();

            res.send(savedEvent)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Evenement save",error, req?.params?.id)
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const evenementRequete = await evenementSchema.validateAsync(req.body);
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const sectionDemandee = req.baseUrl.split('/')[2];
            const filtre = { _id:evenementRequete._id , antenneId: userReferent.antenneDefautId }

            const doesExist = await Evenement.findOne(filtre)
            if (!doesExist)
                throw createError.NotFound(`${evenementRequete._id} not found`);

            evenementRequete.entitee = sectionDemandee;
            evenementRequete.modifiePar = req.payload.userId
            const updatedEvent = await Evenement.findOneAndUpdate(filtre, evenementRequete, {
                returnOriginal: false
            });
            res.send(updatedEvent)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Evenement update",error, req?.params?.id)
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = req.params.id
            const userReferent = await UserController.getCurrentUser(req, res, next);
            const filtre = { _id:id, antenneId: userReferent.antenneDefautId }

            const doesExist = await Evenement.findOneAndDelete(filtre)
            res.send(doesExist._id)

        } catch (error) {
            logErreur("Evenement delete",error, req?.params?.id)
            next(error)
        }
    }
}