const express = require('express')
const GoogleController = require('../Controllers/Google.Controller')
const reportingRouter = express.Router()

reportingRouter.post('/remplirGoogleSheet', GoogleController.remplirGoogleSheet)


module.exports = reportingRouter