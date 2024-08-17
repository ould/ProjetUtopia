const adminRouter = (require('express')).Router()
const userController = require('../Controllers/User.Controller')
const ProfilController = require('../Controllers/Profil.Controller')
const logController = require('../Controllers/Log.Controller')

//Utilisateur
adminRouter.get('/user/getAll', userController.getAll)

adminRouter.get('/user/:id', userController.getById)

adminRouter.post('/user/', userController.save)

adminRouter.put('/user/', userController.update)

adminRouter.delete('/user/:id', userController.delete)

//Profil
adminRouter.post('/profil/getAll/', ProfilController.getAll)

adminRouter.get('/profil/:id', ProfilController.get)

adminRouter.post('/profil/', ProfilController.save)

adminRouter.put('/profil/', ProfilController.update)

adminRouter.delete('/profil/:id', ProfilController.delete)


//Logs
adminRouter.get('/log/getAll/', logController.getAll)

adminRouter.get('/log/getByDate/', logController.getByDate)

adminRouter.get('/log/getByUser/', logController.getByUser)

adminRouter.post('/log/', logController.save)


module.exports = adminRouter