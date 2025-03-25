const express = require('express')
const AntennesController = require('../Controllers/Antennes.Controller')
const logController = require('../Controllers/Log.Controller')
const userController = require('../Controllers/User.Controller')
const publicRouter = express.Router()

publicRouter.get('/antenne/getAll/', AntennesController.getAll) 

publicRouter.post('/log/', logController.save)

publicRouter.post('/accepteReinitialisationMotDePasse/', userController.accepteReinitialisationMotDePasse)

module.exports =  publicRouter