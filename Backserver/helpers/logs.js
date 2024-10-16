const createError = require('http-errors');
const Log = require('../Models/Log.model')


module.exports = {
  logInfo: async (message, utilisateurId) => {
    log("Back",message, utilisateurId, "Info", "Back")
  },
  logErreur: async (operation ,message, utilisateurId) => {
    log(operation,message, utilisateurId, "Erreur", "Back")
  }
}


async function log(operation,message, utilisateurId, type, application) {
  try {
    let result = {};
    result.message = message  ?? "Inconnu";
    result.operation = operation  ?? "Inconnu";
    result.utilisateurId = utilisateurId ?? "Inconnu";
    result.type = type  ?? "Inconnu";
    result.application = application  ?? "Inconnu";
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

