const createError = require('http-errors')
const User = require('../Models/User.model')
const { userSchema } = require('../helpers/validation_schema');
const Groupe = require('../Models/Groupe.model');

module.exports = {


    getAll: async (req, res, next) => {
        try {
            const users = await User.find();
            res.send(users)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    save: async (req, res, next) => {
        try {
            const result = await userSchema.validateAsync(req.body)
            result.creePar = req.payload.userId

            if (result._id) {
                throw createError.Conflict(`${result._id} is already `);
            }

            const user = new User(result)
            const saveduser = await user.save()
            const savefuserId = saveduser._id

            res.send(savefuserId)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const result = await userSchema.validateAsync(req.body, { allowUnknown: true })

            //TODO ; check pour que seul admin peut creer/modifier un admin  (sauf si premier admin)
            const doesExist = await User.findOne({ _id: result._id })
            if (!doesExist) {
                throw createError.NotFound(`${result._id} not found`);
            }

            result.modifiePar = req.payload.userId

            const filter = { _id: result._id };
            const updateduser = await User.findOneAndUpdate(filter, result, {
                returnOriginal: false
            });
            res.send(updateduser._id)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    get: async (req, res, next) => {
        try {
            const id = req.params.id

            const doesExist = await User.findOne({ _id: id })
            if (!doesExist) {
                throw createError.NotFound(`${result} not found`);
            }
            res.send(doesExist)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    //Permet de visualiser sur l'appli front les entités selon son groupe
    isGroupe: async (req, res, next) => {
        try {
            const userId = req.payload.userId;
            
            const user = await User.findOne({ _id: userId });
            //Si admin, toujours ok (TODO à voir selon les regles metier, admin perimetre etc)
            const groupeAdmin = await Groupe.findOne({ nom: "Admin" });
            if(user.groupes.includes(groupeAdmin._id)){
                res.send(true)
            }
            else{
                const nomGroupeAVerifier = req.params.nomGroupeAVerifier
                const groupeAChek = await Groupe.findOne({ nom: nomGroupeAVerifier });
                const estInclus =  user.groupes.includes(groupeAChek._id);
                
                res.send(estInclus)
            }
          } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
          }
    },

    delete: async (req, res, next) => {
        try {
            const id = req.params.id

            const doesExist = await User.findOneAndDelete({ _id: id })
            res.send(doesExist.id)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
}
