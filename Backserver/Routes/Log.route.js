const express = require('express')
const logController = require('../Controllers/Log.Controller')
const logRouter = express.Router()

logRouter.post('/', logController.save)

module.exports = logRouter