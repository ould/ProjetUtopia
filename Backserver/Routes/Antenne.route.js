const express = require('express')
const AntennesController = require('../Controllers/Antennes.Controller')
const antenneRouter = express.Router()
const antennePublicRouter = express.Router()

antenneRouter.get('/getAll/', AntennesController.getAll) // ne pas oublier le / à la fin sinon ça ne foncitonne pas 

antennePublicRouter.get('/getAll/', AntennesController.getAll) 

antenneRouter.get('/:id', AntennesController.get)


module.exports = antenneRouter, antennePublicRouter