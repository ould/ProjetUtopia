const createError = require('http-errors')
const Famille = require('../Models/Famille.model')
const { familleSchema } = require('../helpers/validation_schema');
const UserController = require('./User.Controller');
const { historique_ChercheChampsModifies } = require('../helpers/methodes');
const HistoriqueController = require('./Historique.Controller');
const { logErreur, logInfo } = require('../helpers/logs');

module.exports = {
  get: async (req, res, next) => {
    try {
      const id = req.params.id
      const userReferent = await UserController.getCurrentUser(req, res, next)

      const familleExistante = await Famille.findOne({ _id: id, antenneId: userReferent.antenneDefautId })
      if (!familleExistante)
        throw createError.NotFound(`${id} not found`);
      res.send(familleExistante)

    } catch (error) {
      logErreur(error, req?.params?.id)
      next(error)
    }
  },
  save: async (req, res, next) => {
    try {
      const familleASauver = await familleSchema.validateAsync(req.body, { allowUnknown: true });
      const userReferent = await UserController.getCurrentUser(req, res, next)
      
      familleASauver.antenneId = userReferent.antenneDefautId;
      familleASauver.creePar = userReferent._id;
      const nouvelleFamille = new Famille(familleASauver);
      const savedFamille = await nouvelleFamille.save();
      
      res.send(savedFamille._id)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      logErreur(error, req?.params?.id)
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const familleRequete = await familleSchema.validateAsync(req.body, { allowUnknown: true })
      const userReferent = await UserController.getCurrentUser(req, res, next)
      const userId = req.payload.userId

      const filter = { _id: familleRequete._id, antenneId: userReferent.antenneDefautId  };
      const FamilleExistante = await Famille.findOne(filter)
      if (!FamilleExistante)
        throw createError.NotFound(`${familleRequete.id} not found`);

      familleRequete.modifiePar = userId
      familleRequete.dateModification = Date.now();

      const updatedFamille = await Famille.findOneAndUpdate(filter, familleRequete, {
        returnOriginal: false
      });
      const champsModifies = historique_ChercheChampsModifies(FamilleExistante, familleRequete)
      HistoriqueController.save(process.env.contexte_famille,champsModifies, userId)
      
      res.send(updatedFamille.id)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      logErreur(error, req?.params?.id)
      next(error)
    }
  },


  search: async (req, res, next) => {
    try {
      const nom = req.params.nom
      const userReferent = await UserController.getCurrentUser(req, res, next)

      const filter = { "nom": { $regex: nom }, "antenneId": userReferent.antenneDefautId }; //TODO ajouter champ recherché

      const listeFamilles = await Famille.find(filter)
      if (!listeFamilles)
        throw createError.NotFound(`${nom} not found`);
      res.send(listeFamilles)

    } catch (error) {
      logErreur(error, req?.params?.id)
      next(error)
    }
  },

  recentes: async (req, res, next) => {
    try {
      const userReferent = await UserController.getCurrentUser(req, res, next)

      const filter = {"antenneId": userReferent.antenneDefautId };

      const listeFamilles = await Famille.find(filter).sort({ dateCreation: -1 }) // Trie par dateDeCreation en ordre décroissant
      .limit(5); // Limite à 5 résultats
      if (!listeFamilles)
        throw createError.NotFound(`recentes not found`);
      res.send(listeFamilles)

    } catch (error) {
      logErreur(error, req?.params?.id)
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id
      const userReferent =  await UserController.getCurrentUser(req, res, next);

      const familleExistante = await Famille.findOneAndDelete({ _id: id, antenneId: userReferent.antenneDefautId });
      res.send(familleExistante._id)

    } catch (error) {
      logErreur(error, req?.params?.id)
      next(error)
    }
  }
}

