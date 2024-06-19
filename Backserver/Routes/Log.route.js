const express = require('express')
const logController = require('../Controllers/Log.Controller')
const logRouter = express.Router()
const logPublicRouter = express.Router()

logRouter.get('/getAll/', logController.getAll)

logRouter.get('/getByDate/', logController.getByDate)

logRouter.get('/getByUser/', logController.getByUser)

logRouter.post('/', logController.save)

logPublicRouter.post('/', logController.save)

module.exports = logRouter, logPublicRouter