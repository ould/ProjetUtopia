const express = require('express')
const referentielGlobalRouter = express.Router()
const ReferentielController = require('../Controllers/Referentiel.Controller')

referentielGlobalRouter.get('/getByNom/:nom', ReferentielController.getGlobalByNom)

module.exports = referentielGlobalRouter