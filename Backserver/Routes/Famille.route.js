const express = require('express')
const familleRouter = express.Router()
const FamilleController = require('../Controllers/Famille.Controller')

familleRouter.get('/:id', FamilleController.get)

familleRouter.get('/search/:nomFamille', FamilleController.search)

familleRouter.post('/', FamilleController.save)

familleRouter.put('/', FamilleController.update)

familleRouter.delete('/:id', FamilleController.delete)

module.exports = familleRouter