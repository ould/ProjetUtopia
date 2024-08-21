const createError = require('http-errors')
const User = require('../Models/User.model')
const { userSchema } = require('../helpers/validation_schema');
const Antenne = require('../Models/Antenne.model');
const Profil = require('../Models/Profil.model');

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
            const utilisateurRequete = await userSchema.validateAsync(req.body, { allowUnknown: true })
            
            if (utilisateurRequete._id) throw createError.Conflict(`${utilisateurRequete._id} is already `);
            
            utilisateurRequete.creePar = req.payload.userId
            const nouvelUtilisateur = new User(utilisateurRequete)
            const utilisateurSauve = await nouvelUtilisateur.save()
            const utilisateurId = utilisateurSauve._id
            if (utilisateurRequete._id) throw createError.Conflict(`${utilisateurRequete._id} is already `);

            res.send(utilisateurId)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const utilisateurRequete = await userSchema.validateAsync(req.body, { allowUnknown: true })

            const utilisateurExistant = await User.findOne({ _id: utilisateurRequete._id })
            if (!utilisateurExistant)  throw createError.NotFound(`${utilisateurRequete._id} not found`);
            
            utilisateurRequete.modifiePar = req.payload.userId

            const filter = { _id: utilisateurRequete._id };
            const updateduser = await User.findOneAndUpdate(filter, utilisateurRequete, {
                returnOriginal: false
            });
            res.send(updateduser._id)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    getById: async (req, res, next) => {
        try {
            const id = req.params.id

            const utilisateurExistant = await User.findOne({ _id: id })
            if (!utilisateurExistant) {
                throw createError.NotFound(`${id} not found`);
            }
            res.send(utilisateurExistant)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    getCurrentUser: async (req, res, next) => {
        try {
            const id = req.payload.userId; 

            const utilisateurExistant = await User.findOne({ _id: id })
            if (!utilisateurExistant) {
                throw createError.NotFound(`${id} not found`);
            }
            res.send(utilisateurExistant)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    //Permet de visualiser sur l'appli front les entités selon ses acces aux sections (contexte metier)
    accesSection: async (req, res, next) => {
        try {
            const userId = req.payload.userId;

            const user = await User.findOne({ _id: userId });
            //Si admin, toujours ok (TODO à voir selon les regles metier, admin perimetre etc)
            const profilAdmin = await Profil.findOne({ nom: process.env.contexte_admin });
            if (user.profilId.includes(profilAdmin._id)) {
                res.send(true)
            }
            else {
                const nomSectionDemandee = req.params.nomSectionDemandee
                const profilUtilisateur = await Profil.findOne({ _id: user.profilId });
                const accesAutorise = profilUtilisateur.tableauDroits.find(item => item.section === nomSectionDemandee).length > 0
                res.send(accesAutorise)
            }
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
    
    //Permet de visualiser sur l'appli front les entités selon ses acces aux sections (contexte metier)
    accesSection: async (req, res, next) => {
        try {
            const userId = req.payload.userId;

            const user = await User.findOne({ _id: userId });
            //Si admin, toujours ok (TODO à voir selon les regles metier, admin perimetre etc)
            const profilAdmin = await Profil.findOne({ nom: process.env.contexte_admin });
            if (user.profilId.includes(profilAdmin._id)) {
                res.send(true)
            }
            else {
                const nomSectionDemandee = req.params.nomSectionDemandee
                const profilUtilisateur = await Profil.findOne({ _id: user.profilId });
                const accesAutorise = profilUtilisateur.tableauDroits.find(item => item.section === nomSectionDemandee).length > 0
                res.send(accesAutorise)
            }
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    isProfile: async (req, res, next) => {
        try {
            const userId = req.payload.userId;

            const user = await User.findOne({ _id: userId });
            //Si admin, toujours ok (TODO à voir selon les regles metier, admin perimetre etc)
            const profilAdmin = await Profil.findOne({ nom: process.env.contexte_admin });
            if (user.profilId.includes(profilAdmin._id)) {
                res.send(true)
            }
            else {
                const nomProfilRequete = req.params.nomProfilAVerifier
                const ProfilRequete = await Profil.findOne({ nom: nomProfilRequete });
                const estInclus = user.profilId.includes(ProfilRequete._id);

                res.send(estInclus)
            }
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    //Permet de visualiser sur l'appli front les entités selon ses droits et la section demandée (bouton ajouter etc)
    isDroit: async (req, res, next) => {
        try {
            const userId = req.payload.userId;

            const user = await User.findOne({ _id: userId });
            //Si admin, toujours ok (TODO à voir selon les regles metier, admin perimetre etc) a remplacer peut etre par un droit admin aussi 
            const groupeAdmin = await Groupe.findOne({ nom: process.env.contexte_admin });
            if (user.groupes.includes(groupeAdmin._id)) {
                res.send(true)
            }
            else {
                const nomGDroitAVerifier = req.params.nomDroitAVerifier
               //TODO a faire 

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
            res.send(userDroits)
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
            for (const antenneId of doesExist.antennes) {
                const result = await Antenne.findOne({ _id: antenneId });
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

            const utilisateurExistant = await User.findOne({ _id: idUser })        
            if (!utilisateurExistant) {
                throw createError.NotFound(`${idUser} not found`);
            }
            const result = await Antenne.findOne({ _id: utilisateurExistant.antenneDefautId });
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
            const utilisateurExistant = await User.findOne({ _id: idUser })           
            if (!utilisateurExistant) {
                throw createError.NotFound(`${idUser} not found`);
            }
            //Cherche l'id de l'antenne avec le nom spécifié et modifie l'utilisateur
            const resultAntenne = await Antenne.findOne({ _id: nomAntenne });
            if (!resultAntenne) {
                throw createError.NotFound(`${nomAntenne} not found`);
            }
            utilisateurExistant.antenneDefautId = resultAntenne._id
            utilisateurExistant.modifiePar = req.payload.userId
            utilisateurExistant.antenneDefautId = resultAntenne._id
            utilisateurExistant.modifiePar = req.payload.userId

            //MAJ de l'utilisateur
            const filter = { _id: utilisateurExistant._id };          
            const updateduser = await User.findOneAndUpdate(filter, utilisateurExistant, {
                returnOriginal: false
            });
            //Renvoie la nouvelle antenne 
            res.send(resultAntenne)


        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },  
    
    isAdmin: async (req, res, next) => {
        try {    
          const profilUtilisateur = req.payload.profilId
          const profilAdminId = await Profil.findOne({ nom: process.env.contexte_admin })
          const isAdmin = profilUtilisateur.includes(profilAdminId._id);
          res.send(isAdmin)
        } catch (error) {
          if (error.isJoi === true) error.status = 422
          next(error)
        }
      }
}
