const express = require('express')
const InitialiseController = require('../Controllers/Initialise.Controller')
const initialiseRouter = express.Router()

initialiseRouter.get('/initialiseTout', InitialiseController.launch)

initialiseRouter.get('/exist', InitialiseController.exist)



module.exports = initialiseRouter