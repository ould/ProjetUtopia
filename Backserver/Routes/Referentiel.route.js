const express = require('express')
const referentielRouter = express.Router()
const ReferentielController = require('../Controllers/Referentiel.Controller')

referentielRouter.get('/getByNom/:nom', ReferentielController.getGlobalByNom)

//Referentiel pour famille
referentielRouter.get('/famille/getReferentielByNom/:nom', ReferentielController.getByNom)

module.exports = referentielRouter