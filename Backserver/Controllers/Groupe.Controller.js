const createError = require('http-errors')
const { groupeSchema } = require('../helpers/validation_schema')
const Groupe = require('../Models/Groupe.model')

module.exports = {
  save: async (req, res, next) => {
    try {
      const result = req.body
      const doesExist = await Groupe.findOne({ nom: result.nom })
      if (doesExist)
        throw createError.Conflict(`${result.nom} already exist`)

      result.creePar = req.payload.userId

      const groupe = new Groupe(result)
      const savedGroupe = await groupe.save()
      savedGroupe._id = ""
      res.send( savedGroupe)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await groupeSchema.validateAsync(req.body)

      const doesExist = await Groupe.findOne({ nom: result.nom })
      if (!doesExist)
        throw createError.NotFound(`${result.nom} not found`);

      result.modifiePar = req.payload.userId

      const filter = { nom: result.nom };
      const updatedGroupe = await Groupe.findOneAndUpdate(filter, result, {
        returnOriginal: false
      });
      updatedGroupe._id = ""
      res.send(updatedGroupe)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  isAdmin: async (req, res, next) => {
    try {

      const userGroupes = req.payload.groupes
      const groupeAdminId = await Groupe.findOne({ nom: "Admin" })
      const isAdmin = userGroupes.includes(groupeAdminId._id);
      
      res.send(isAdmin)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },


  getUserRole: async (req, res, next) => {
    try {

      const userGroupes = req.payload.groupes
      const isAdmin = userGroupes.includes(groupeAdminId._id);
      //TODO
      res.send(isAdmin )
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {

      const id = req.params.id

      const doesExist = await Groupe.findOne({ _id: id })
      if (!doesExist)
        throw createError.NotFound(`${id} not found`);
      doesExist._id = ""
      res.send(doesExist)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },


  getAllRoles: async (req, res, next) => {
    try {

      const userGroupes = req.payload.groupes
      //TODO verifier admin 
      const groupes = await Groupe.find();
      groupes.forEach(element => {
        element._id = ""
      });
      res.send(groupes )
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id

      const doesExist = await Groupe.findOneAndDelete({ _id: id })
      res.send(doesExist.nom)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  }


}
