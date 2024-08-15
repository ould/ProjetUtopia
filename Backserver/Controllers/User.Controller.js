const createError = require('http-errors')
const User = require('../Models/User.model')
const { userSchema } = require('../helpers/validation_schema');
const Groupe = require('../Models/Groupe.model');
const Antenne = require('../Models/Antenne.model');
const Droit = require('../Models/Droit.model');

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
            if (user.groupes.includes(groupeAdmin._id)) {
                res.send(true)
            }
            else {
                const nomGroupeAVerifier = req.params.nomGroupeAVerifier
                const groupeAChek = await Groupe.findOne({ nom: nomGroupeAVerifier });
                const estInclus = user.groupes.includes(groupeAChek._id);

                res.send(estInclus)
            }
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    //Permet de visualiser sur l'appli front les entités selon ses droits
    isDroit: async (req, res, next) => {
        try {
            const userId = req.payload.userId;

            const user = await User.findOne({ _id: userId });
            //Si admin, toujours ok (TODO à voir selon les regles metier, admin perimetre etc) a remplacer peut etre par un droit admin aussi 
            const groupeAdmin = await Groupe.findOne({ nom: "Admin" });
            if (user.groupes.includes(groupeAdmin._id)) {
                res.send(true)
            }
            else {
                const nomGDroitAVerifier = req.params.nomDroitAVerifier
                const droitAChek = await Droit.findOne({ nom: nomGDroitAVerifier });
                const estInclus = user.droits.includes(droitAChek._id);

                res.send(estInclus)
            }
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    getUserDroits: async (req, res, next) => {
        try {

            //TODO : A faire
            const userDroits = req.payload.droits
            res.send(isAdmin)
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
    },

    getAntennesUser: async (req, res, next) => {
        try {
            const idUser = req.payload.userId

            const doesExist = await User.findOne({ _id: idUser })
            if (!doesExist) {
                throw createError.NotFound(`${idUser} not found`);
            }

            let listeAntennes = []
            for (const antenne of doesExist.antennes) {
                const result = await Antenne.findOne({ _id: antenne });
                listeAntennes.push(result)
            }

            res.send(listeAntennes)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    getAntennesDefautUser: async (req, res, next) => {
        try {
            const idUser = req.payload.userId

            const doesExist = await User.findOne({ _id: idUser })
            if (!doesExist) {
                throw createError.NotFound(`${idUser} not found`);
            }

            const result = await Antenne.findOne({ _id: doesExist.antenneDefaut });
            res.send(result)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    
    changeAntennesUser: async (req, res, next) => {
        try {
            const idUser = req.payload.userId
            const nomAntenne = req.body.nouvelleAntenneId //Post => body
            const doesExist = await User.findOne({ _id: idUser })
            if (!doesExist) {
                throw createError.NotFound(`${idUser} not found`);
            }
            //Cherche l'id de l'antenne avec le nom spécifié et modifie l'utilisateur
            const resultAntenne = await Antenne.findOne({ _id: nomAntenne });
            if (!resultAntenne) {
                throw createError.NotFound(`${nomAntenne} not found`);
            }
            doesExist.antenneDefaut = resultAntenne._id
            doesExist.modifiePar = req.payload.userId

            //MAJ de l'utilisateur
            const filter = { _id: doesExist._id };
            const updateduser = await User.findOneAndUpdate(filter, doesExist, {
                returnOriginal: false
            });
            //Renvoie la nouvelle antenne 
            res.send(resultAntenne)


        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    }
}
