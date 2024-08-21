const express = require('express')
const ProfilController = require('../Controllers/Profil.Controller')
const profilRouter = express.Router()


profilRouter.post('/getAll/', ProfilController.getAll)

profilRouter.get('/:id', ProfilController.get)

profilRouter.post('/', ProfilController.save)

profilRouter.put('/', ProfilController.update)

profilRouter.delete('/:id', ProfilController.delete)

module.exports = profilRouter