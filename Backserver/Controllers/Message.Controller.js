const createError = require('http-errors')
const { messageSchema } = require('../helpers/validation_schema')
const Message = require('../Models/Message.model')

module.exports = {
  save: async (req, res, next) => {
    try {
      const result = await messageSchema.validateAsync(req.body)

      const message = new Message(result)
      const savedmessage = await message.save()
      const savedMessageIdPers = savedmessage.idPersonne
      const savedMessageMessage = savedmessage.message

      res.send(savedMessageIdPers, savedMessageMessage)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await messageSchema.validateAsync(req.body)

      const doesExist = await Message.findOne({ _id: result.id })
      if (!doesExist)
      throw createError.NotFound(`${result.id} not found`);
    
    const filter = { _id: result.id };
    const updatedMessage = await Message.findOneAndUpdate(filter, result, {
      returnOriginal: false
    });
    res.send(updatedMessage.id)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const id = req.params.id
      
      const doesExist = await Message.findOne({ _id: id })
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
      
      const doesExist = await Message.findOneAndDelete({ _id: id })
      res.send(doesExist.id)
    
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  }
}
