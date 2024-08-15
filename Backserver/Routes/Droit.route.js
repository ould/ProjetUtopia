const express = require('express')
const droitRouter = express.Router()
const DroitController = require('../Controllers/Droit.Controller')

droitRouter.get('/:id', DroitController.get)

droitRouter.post('/getAll', DroitController.getAll)

droitRouter.post('/', DroitController.save)

droitRouter.delete('/:id', DroitController.delete)

module.exports = droitRouter