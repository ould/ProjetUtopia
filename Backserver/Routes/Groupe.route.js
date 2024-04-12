const express = require('express')
const groupeRouter = express.Router()
const GroupeController = require('../Controllers/Groupe.Controller')

groupeRouter.get('/:id', GroupeController.get)

groupeRouter.post('/isAdmin', GroupeController.isAdmin)

groupeRouter.post('/getUserGroupe', GroupeController.getUserRole)

groupeRouter.post('/getAllGroupes', GroupeController.getAll)

groupeRouter.post('/', GroupeController.save)

groupeRouter.put('/', GroupeController.update)

groupeRouter.delete('/:id', GroupeController.delete)

module.exports = groupeRouter