const selfUserRouter = (require('express')).Router()
const userController = require('../Controllers/User.Controller')

//Route pour les actions utilisateurs qui ne concernent que soi meme et qui ne sont pas critiques => (moins de restrictions)
selfUserRouter.get('/antennes/', userController.getAntennesUser)

selfUserRouter.get('/antenneDefaut/', userController.getAntennesDefautUser)

selfUserRouter.get('/isAdmin', userController.isAdmin)

selfUserRouter.get('/isGroupe/:nomGroupeAVerifier', userController.isGroupe)

selfUserRouter.post('/antenneDefaut', userController.changeAntennesUser)


module.exports = selfUserRouter