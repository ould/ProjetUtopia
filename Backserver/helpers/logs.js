const createError = require('http-errors')



module.exports = {
  logInfo: async (req, res, next) => {
    log(req, res, next, nomGroupeAdmin, "Info")
  }
}


async function log(req, res, next, nomDroit, message) {
  try {

      return next(createError.Unauthorized(message))
    
  } catch (error) {
    error.status = 500
    next(error)
  }
}

