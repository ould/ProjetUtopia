const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')
const { addDateHours } = require('../helpers/date')

module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body)

      const doesExist = await User.findOne({ email: result.email })
      if (doesExist)
        throw createError.Conflict(`${result.email} is already been registered`)

      result.droits = ["0"]
      result.creePar = "0" //Créé par lui meme 

      const user = new User(result)
      const savedUser = await user.save()
      console.log(savedUser.groupes)
      const accessToken = await signAccessToken(savedUser)

      res.send({ accessToken })
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body)
      const user = await User.findOne({ email: result.email })
      if (!user) throw createError.NotFound('User not registered')
      
      const isMatch = await user.isValidPassword(result.password)
      if (!isMatch)
      throw createError.Unauthorized('Username/password not valid')
    
    const accessToken = await signAccessToken(user)
    const expiresAt = addDateHours(20);

      res.send({ accessToken, user,  expiresAt})
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Invalid Username/Password'))
      next(error)
    }
  },


}
