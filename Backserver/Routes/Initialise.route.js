const express = require('express')
const InitialiseController = require('../Controllers/Initialise.Controller')
const initialiseRouter = express.Router()

initialiseRouter.get('/initialiseTout', InitialiseController.launch)



module.exports = initialiseRouter