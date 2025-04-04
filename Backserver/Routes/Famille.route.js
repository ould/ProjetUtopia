const express = require('express')
const familleRouter = express.Router()
const FamilleController = require('../Controllers/Famille.Controller')
const BeneficiaireController = require('../Controllers/Beneficiaire.Controller')

familleRouter.get('/recentes/', FamilleController.recentes)

familleRouter.get('/:id', FamilleController.get)

familleRouter.get('/search/:nom', FamilleController.search)

familleRouter.post('/', FamilleController.save)

familleRouter.put('/', FamilleController.update)

familleRouter.delete('/:id', FamilleController.delete)

//Beneficiaire famille
familleRouter.get('/membre/:id', BeneficiaireController.getById)

familleRouter.post('/membre/', BeneficiaireController.save)

familleRouter.put('/membre/', BeneficiaireController.update)

familleRouter.delete('/membre/:id', BeneficiaireController.delete)

module.exports = familleRouter