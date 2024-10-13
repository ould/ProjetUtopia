const createError = require('http-errors');
const Log = require('../Models/Log.model')


module.exports = {
  logInfo: async (message, utilisateurId) => {
    log(message, utilisateurId, "Info", "Back")
  },
  logErreur: async (message, utilisateurId) => {
    log(message, utilisateurId, "Erreur", "Back")
  }
}


async function log(message, utilisateurId, type, application) {
  try {
    let result = {};
    result.message = message;
    result.utilisateurId = utilisateurId;
    result.type = type;
    result.application = application;
    result.date = Date.now();

    const log = new Log(result)
    await log.save()
    return true;
    
  } catch (error) {
    error.status = 500
    console.log(error);
    throw createError[500](`log error` + error);
  }
}

