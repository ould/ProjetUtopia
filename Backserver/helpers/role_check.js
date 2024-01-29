const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const Groupe = require('../Models/Groupe.model')
const User = require('../Models/User.model')

const nomGroupeAdmin = "Admin"

module.exports = {
    haveAdminRole: async (req, res, next) => {
        try {
            const userId= req.payload.userId;
            const groupeAdmin = await Groupe.findOne({ nom: "Admin" });
            const user = await User.findOne({ _id: userId });
            const isAdmin = user.groupes.includes(groupeAdmin._id);
        if(isAdmin)
          return next()
        else{
            return next(createError.Unauthorized("Not admin"))
        }
        
        } catch (error) {
          if (error.isJoi === true) error.status = 422
          next(error)
        }
      },
}
