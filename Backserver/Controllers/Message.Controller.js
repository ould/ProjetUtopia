const createError = require('http-errors')
const { messageSchema } = require('../helpers/validation_schema')
const Message = require('../Models/Message.model')
const { logErreur, logInfo } = require('../helpers/logs');

module.exports = {
  save: async (req, res, next) => {
    try {
      const result = await messageSchema.validateAsync(req.body)
      result.creePar = req.payload.userId

      const message = new Message(result)
      const savedmessage = await message.save()
      const savedMessageIdPers = savedmessage.idPersonne
      const savedMessageMessage = savedmessage.message

      res.send(savedMessageIdPers, savedMessageMessage)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      logErreur("Message save",error, req?.params?.id)
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await messageSchema.validateAsync(req.body)

      const doesExist = await Message.findOne({ _id: result.id })
      if (!doesExist)
        throw createError.NotFound(`${result.id} not found`);

      result.modifiePar = req.payload.userId

      const filter = { _id: result.id };
      const updatedMessage = await Message.findOneAndUpdate(filter, result, {
        returnOriginal: false
      });
      res.send(updatedMessage.id)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      logErreur("Message update",error, req?.params?.id)
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const id = req.params.id

      const doesExist = await Message.findOne({ _id: id })
      if (!doesExist)
        throw createError.NotFound(`${result} not found`);
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      logErreur("Message get",error, req?.params?.id)
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
      logErreur("Message delete",error, req?.params?.id)
      next(error)
    }
  }
}
