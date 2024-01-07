const express = require('express')
const ChatController = require('../Controllers/Chat.Controller')
const chatRouter = express.Router()

chatRouter.get('/:id', ChatController.get)

chatRouter.get('/search/:nom', ChatController.search)

chatRouter.post('/', ChatController.save)

chatRouter.put('/', ChatController.update)

chatRouter.delete('/:id', ChatController.delete)

module.exports = chatRouter