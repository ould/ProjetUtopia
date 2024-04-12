const express = require('express')
const AntennesController = require('../Controllers/Antennes.Controller')
const antenneRouter = express.Router()

antenneRouter.get('/:nom', AntennesController.get)

antenneRouter.get('/getAll', AntennesController.getAll)

module.exports = antenneRouter