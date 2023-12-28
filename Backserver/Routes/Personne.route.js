const express = require('express')
const personneRouter = express.Router()
const PersonneController = require('../Controllers/Personne.Controller')

personneRouter.get('/:id', PersonneController.get)

personneRouter.post('/save', PersonneController.save)

personneRouter.post('/update', PersonneController.update)

personneRouter.delete('/:id', PersonneController.delete)

module.exports = personneRouter