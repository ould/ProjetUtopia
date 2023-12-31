const createError = require('http-errors')
const Chat = require('../Models/Chat.model')
const { chatSchema } = require('../helpers/validation_schema')

module.exports = {
  save: async (req, res, next) => {
    try {
      const result = await chatSchema.validateAsync(req.body)

      const chat = new Chat(result)
      const savedChat = await chat.save()
      const savedChatId = savedChat._id
      const savedChatnom = savedChat.nom

      res.send(savedChatId, savedChatnom)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await chatSchema.validateAsync(req.body)

      const doesExist = await Chat.findOne({ _id: result.id })
      if (!doesExist)
      throw createError.NotFound(`${result.id} not found`);
    
    const filter = { _id: result.id };
    const updatedChat = await Chat.findOneAndUpdate(filter, result, {
      returnOriginal: false
    });
    res.send(updatedChat.id)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const id = req.params.id
      
      const doesExist = await Chat.findOne({ _id: id })
      if (!doesExist)
      throw createError.NotFound(`${result} not found`);
      res.send( doesExist )

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  search: async (req, res, next) => {
    try {
      const nom = req.params.nom //TODO : verifier chat selon droits utilisateurs
      
      const doesExist = await Chat.find({"nom": {$regex : nom}})
      if (!doesExist)
      throw createError.NotFound(`${result} not found`);
      res.send( doesExist )

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id
      
      //TODO : delete all messages
      const doesExist = await Chat.findOneAndDelete({ _id: id })
      res.send(doesExist.id)
    
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  }
}
