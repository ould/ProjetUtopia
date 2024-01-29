const express = require('express')
const personneTypeRouter = express.Router()
const PersonneTypeController = require('../Controllers/PersonneType.Controller')

personneTypeRouter.get('/:id', PersonneTypeController.get)

personneTypeRouter.get('/getalltypes', PersonneTypeController.getAllTypes)

personneTypeRouter.post('/', PersonneTypeController.save)

personneTypeRouter.put('/', PersonneTypeController.update)

personneTypeRouter.delete('/:id', PersonneTypeController.delete)

module.exports = personneTypeRouter