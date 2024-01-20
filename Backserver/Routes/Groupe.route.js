const express = require('express')
const groupeRouter = express.Router()
const GroupeController = require('../Controllers/Groupe.Controller')

groupeRouter.get('/:id', GroupeController.get)

groupeRouter.post('/isadmin', GroupeController.isAdmin)

groupeRouter.post('/getuserrole', GroupeController.getUserRole)

groupeRouter.post('/getallrole', GroupeController.getAllRoles)

groupeRouter.post('/', GroupeController.save)

groupeRouter.put('/', GroupeController.update)

groupeRouter.delete('/:id', GroupeController.delete)

module.exports = groupeRouter