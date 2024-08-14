const selfUserRouter = (require('express')).Router()
const userController = require('../Controllers/User.Controller')


selfUserRouter.get('/antennes/', userController.getAntennesUser)

selfUserRouter.get('/antenneDefaut/', userController.getAntennesDefautUser)

selfUserRouter.post('/antenneDefaut/', userController.changeAntennesUser)


module.exports = selfUserRouter