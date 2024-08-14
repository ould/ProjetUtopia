const express = require('express')
const AntennesController = require('../Controllers/Antennes.Controller')
const logController = require('../Controllers/Log.Controller')
const publicRouter = express.Router()

publicRouter.get('/antenne/getAll/', AntennesController.getAll) 

publicRouter.post('/Logs/', logController.save)

module.exports =  publicRouter