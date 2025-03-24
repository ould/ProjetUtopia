const selfUserRouter = (require('express')).Router()
const userController = require('../Controllers/User.Controller')

//Route pour les actions utilisateurs qui ne concernent que soi meme et qui ne sont pas critiques => (moins de restrictions)
//Attention a ne pas donner la possibilité de modifier les infos sensibles comme le profil
selfUserRouter.get('/antennes/', userController.getAntennesUser)

selfUserRouter.get('/antenneDefaut/', userController.getAntennesDefautUser)

selfUserRouter.get('/isAdmin', userController.isAdmin)

selfUserRouter.get('/accesSection/:nomSectionDemandee', userController.accesSection)

selfUserRouter.get('/droits/:nomSectionDemandee', userController.getDroitsSection)

selfUserRouter.post('/antenneDefaut', userController.changeAntennesUser)

selfUserRouter.post('/reinitialiseMotDePasse', userController.reinitialiseMotDePasse)


module.exports = selfUserRouter