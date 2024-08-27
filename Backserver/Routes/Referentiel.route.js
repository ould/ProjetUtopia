const express = require('express')
const ReferentielRouter = express.Router()
const ReferentielController = require('../Controllers/Referentiel.Controller')

ReferentielRouter.get('/getByNom/:nom', ReferentielController.getByNom)

ReferentielRouter.post('/', ReferentielController.save)

ReferentielRouter.put('/', ReferentielController.update)

ReferentielRouter.delete('/:id', ReferentielController.delete)

module.exports = ReferentielRouter