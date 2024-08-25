const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./init_redis')

module.exports = {
  signAccessToken: (user) => {
    return new Promise((resolve, reject) => {
      const payload = {
        userId: user._id,
        email: user.email,
        profilId: user.profilId,
        nom: user.nom,
        prenom: user.prenom
      }
      const secret = process.env.ACCESS_TOKEN_SECRET
      const options = {
        expiresIn: '20h',
        issuer: 'utopiaApp.fr',
        audience: user._id + "",
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    try {
      if (!req.headers['authorization']) return next(createError.Unauthorized())
      const authHeader = req.headers['authorization']
      const bearerToken = authHeader.split(' ')
      const token = bearerToken[1]
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          const message =
            err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
          return next(createError.Unauthorized(message))
        }
        req.payload = payload
        next()
      })
    } catch (error) {
      next(createError.NotImplemented("Erreur serveur"))
    }
  },
}
