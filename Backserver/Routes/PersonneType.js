const express = require('express')
const personneTypeRouter = express.Router()
const PersonneTypeController = require('../Controllers/PersonneType.Controller')

personneTypeRouter.get('/:id', PersonneTypeController.get)

personneTypeRouter.post('/getAllTypes', PersonneTypeController.getAll)

personneTypeRouter.post('/', PersonneTypeController.save)

personneTypeRouter.put('/', PersonneTypeController.update)

personneTypeRouter.delete('/:id', PersonneTypeController.delete)

module.exports = personneTypeRouter