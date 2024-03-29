const personneRouter = (require('express')).Router()
const PersonneController = require('../Controllers/Personne.Controller')

personneRouter.get('/:id', PersonneController.get)

personneRouter.post('/', PersonneController.save)

personneRouter.put('/', PersonneController.update)

personneRouter.delete('/:id', PersonneController.delete)

module.exports = personneRouter