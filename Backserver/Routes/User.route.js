const userRouter = (require('express')).Router()
const userController = require('../Controllers/User.Controller')

userRouter.get('/getAllUsers/', userController.getAll)

userRouter.get('/isGroupe/:nomGroupeAVerifier', userController.isGroupe)

userRouter.get('/:id', userController.get)

userRouter.post('/', userController.save)

userRouter.put('/', userController.update)

userRouter.delete('/:id', userController.delete)


module.exports = userRouter