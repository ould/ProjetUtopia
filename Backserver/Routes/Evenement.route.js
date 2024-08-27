const express = require('express')
const EvenementRouter = express.Router()
const EvenementController = require('../Controllers/Evenement.Controller')

EvenementRouter.get('/getByEntiteeId/:id', EvenementController.getByEntiteeId)

EvenementRouter.post('/', EvenementController.save)

EvenementRouter.put('/', EvenementController.update)

EvenementRouter.delete('/:id', EvenementController.delete)

module.exports = EvenementRouter