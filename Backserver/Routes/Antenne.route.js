const express = require('express')
const AntennesController = require('../Controllers/Antennes.Controller')
const antenneRouter = express.Router()

antenneRouter.get('/getAll/', AntennesController.getAll) // ne pas oublier le / à la fin sinon ça ne foncitonne pas 

antenneRouter.get('/getById/:id', AntennesController.getById)

antenneRouter.get('/getByNom/:nom', AntennesController.getByNom)

module.exports = antenneRouter