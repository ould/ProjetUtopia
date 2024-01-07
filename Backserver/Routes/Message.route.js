const express = require('express')
const MessageController = require('../Controllers/Message.Controller')
const messageRouter = express.Router()

messageRouter.get('/:id', MessageController.get)

messageRouter.post('/', MessageController.save)

messageRouter.put('/', MessageController.update)

messageRouter.delete('/:id', MessageController.delete)

module.exports = messageRouter