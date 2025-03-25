const createError = require('http-errors')
const moment = require('moment');
const User = require('../Models/User.model')
const { userSchema } = require('../helpers/validation_schema');
const Antenne = require('../Models/Antenne.model');
const Profil = require('../Models/Profil.model');
const { historique_ChercheChampsModifies, generationMotAleatoire } = require('../helpers/methodes');
const HistoriqueController = require('./Historique.Controller');
const { logErreur, logInfo } = require('../helpers/logs');
const { envoyerMail } = require('../helpers/email');
const {LienTemp, OperationEnum} = require('../Models/LienTemporaire.model');

module.exports = {

    getAll: async (req, res, next) => {
        try {
            const users = await User.find();
            res.send(users)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Utilisateur getAll",error, req?.params?.id)
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
            logInfo("Création utilisateur :" + utilisateurId , req?.params?.id)
            res.send(utilisateurId)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Utilisateur save",error, req?.params?.id)
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const utilisateurRequete = await userSchema.validateAsync(req.body, { allowUnknown: true })

            const utilisateurExistant = await User.findOne({ _id: utilisateurRequete._id })
            if (!utilisateurExistant) throw createError.NotFound(`${utilisateurRequete._id} not found`);

            const profilAdmin = await Profil.findOne({ nom: process.env.contexte_admin });
            if(utilisateurExistant.profilId  === profilAdmin._id || utilisateurRequete.profilAdmin === profilAdmin._id){
                logInfo("Modification d'un profil admin par " + req.payload.userId)                
            }
                utilisateurRequete.modifiePar = req.payload.userId
                utilisateurRequete.dateModification = Date.now();
    
                const filter = { _id: utilisateurRequete._id };
                const updateduser = await User.findOneAndUpdate(filter, utilisateurRequete, {
                    returnOriginal: false
                });
    
                //Historisation des modifications
                const champsModifies = historique_ChercheChampsModifies(profilExistant, nouveauProfil);
                HistoriqueController.save("Utilisateur", champsModifies, utilisateurRequete._id );

                res.send(updateduser._id)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Utilisateur update",error, req?.params?.id)
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
            logErreur("Utilisateur getById",error, req?.params?.id)
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
            return utilisateurExistant;

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Utilisateur getCurrentUser",error, req?.params?.id)
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
                const accesAutorise = profilUtilisateur.tableauDroits.find(item => item.section === nomSectionDemandee).droits.length > 0
                res.send(accesAutorise)
            }
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Utilisateur accesSection",error, req?.params?.id)
            next(error)
        }
    },

    //Permet de visualiser sur l'appli front les entités selon ses droits et la section demandée (bouton ajouter etc)
    getDroitsSection: async (req, res, next) => {
        try {
            const userId = req.payload.userId;
            const user = await User.findOne({ _id: userId });

            const nomSectionDemandee = req.params.nomSectionDemandee
            const profilUtilisateur = await Profil.findOne({ _id: user.profilId });
            const tableauDroitSection = profilUtilisateur.tableauDroits.find(item => item.section === nomSectionDemandee)
            res.send(tableauDroitSection)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            logErreur("Utilisateur getDroitsSection",error, req?.params?.id)
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
            logErreur("Utilisateur isProfile",error, req?.params?.id)
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
            logErreur("Utilisateur getUserDroits",error, req?.params?.id)
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
            logErreur("Utilisateur delete",error, req?.params?.id)
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
            logErreur("Utilisateur getAntennesUser",error, req?.params?.id)
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
            logErreur("Utilisateur getAntennesDefautUser",error, req?.params?.id)
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
            logErreur("Utilisateur changeAntennesUser",error, req?.params?.id)
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
            logErreur("Utilisateur isAdmin",error, req?.params?.id)
            next(error)
        }
    },


    demandeReinitialiseMotDePasseByEmail: async (req, res, next) => {
        try {
            const idUser = req.payload?.userId ?? "0"
            const emailUserAModifier = req.body.email
            const utilisateurExistant = await User.findOne({ email: emailUserAModifier })
            if (!utilisateurExistant) {
                logInfo("Mauvaise réinitialisation de mot de passe pour " + emailUserAModifier)  
                return res.send(true) // Pas de message d'erreur pour eviter de donner des infos sur les utilisateurs
            }
            logInfo("Réinitialisation de mot de passe pour " + utilisateurExistant.email)  

            let hashTemporaire = generationMotAleatoire(16)
            let lien = process.env.URL_FRONT+ "/reinitialisation-mot-de-passe/" + hashTemporaire
            
            let dateExpiration = moment(Date.now()).add(30, 'm').toDate();

            let lienTemporaire = new LienTemp({ dateExpiration: dateExpiration, hash: hashTemporaire, cibleId: utilisateurExistant._id, creePar: idUser , operation : OperationEnum.REINITIALISATION_MDP})
            lienTemporaire.save()

            envoyerMail(utilisateurExistant.email, "Réinitialisation de mot de passe", "Votre demande de réinitialisation de mot de passe est prise en compte. Veuillez cliquer sur le lien suivant pour le modifier : " + lien)

            res.send(true)
        } catch (error) {
            logErreur("Utilisateur reinitialiseMotDePasse",error, req?.params?.id)
            next(error)
        }
    },

    accepteReinitialisationMotDePasse: async (req, res, next) => {
        try {
            const hash = req.body.hash
            const nouveauMdp = req.body.nouveauMdp
            const lienTemporaire = await LienTemp.findOne({ hash: hash })
            if (!lienTemporaire || lienTemporaire.operation !== LienTemp.OperationEnum.REINITIALISATION_MDP || lienTemporaire.dateExpiration < Date.now()) {
                return res.send(false)
            }
            const utilisateurExistant = await User.findOne({ _id: lienTemporaire.cibleId })
            if (!utilisateurExistant) {
                return res.send(false)
            }

            utilisateurExistant.motDePasse = nouveauMdp
            utilisateurExistant.modifiePar = lienTemporaire.creePar
            utilisateurExistant.dateModification = Date.now()
            utilisateurExistant.save()
            lienTemporaire.delete()

            res.send(true)
        } catch (error) {
            logErreur("Utilisateur reinitialiseMotDePasse",error, req?.params?.id)
            next(error)
        }
    },

}
