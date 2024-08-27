const adminRouter = (require('express')).Router()
const userController = require('../Controllers/User.Controller')
const ProfilController = require('../Controllers/Profil.Controller')
const logController = require('../Controllers/Log.Controller')
const HistoriqueController = require('../Controllers/Historique.Controller')

//Utilisateur
adminRouter.get('/utilisateur/getAll', userController.getAll)

adminRouter.get('/utilisateur/:id', userController.getById)

adminRouter.post('/utilisateur/', userController.save)

adminRouter.put('/utilisateur/', userController.update)

adminRouter.delete('/utilisateur/:id', userController.delete)

//Profil
adminRouter.get('/profil/getAll', ProfilController.getAll)

adminRouter.get('/profil/:id', ProfilController.get)

adminRouter.post('/profil/', ProfilController.save)

adminRouter.put('/profil/', ProfilController.update)

adminRouter.delete('/profil/:id', ProfilController.delete)


//Logs
adminRouter.get('/log/getAll/', logController.getAll)

adminRouter.get('/log/getByDate/', logController.getByDate)

adminRouter.get('/log/getByUser/', logController.getByUser)

adminRouter.post('/log/', logController.save)

//Historique : TODO


module.exports = adminRouter