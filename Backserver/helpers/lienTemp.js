
const { generationMotAleatoire } = require('../helpers/methodes');
const moment = require('moment');
const { LienTemp, OperationEnum } = require('../Models/LienTemporaire.model');

module.exports = {
    GetLienTemporaireFront: async (operation, cibleId, creePar) => {
        return await GetLienTemporaireFront(operation, cibleId, creePar)
    },
    CheckEtDeleteLienTemporaire: async (hash, operation) => {
        return await CheckEtDeleteLienTemporaire(hash, operation)
    }
}

async function GetLienTemporaireFront(operation, cibleId, creePar = "0") {
    try {
        let hashTemporaire = generationMotAleatoire(25)
        let paramUrl;
        switch (operation) {
            case OperationEnum.REINITIALISATION_MDP:
                paramUrl = "reinitialisation-mot-de-passe";
                break;
            case OperationEnum.CONFIRMATION_EMAIL:
                paramUrl = "confirmation-email";
                break;
            // Add more cases here if there are additional operations
            default:
                throw new Error("Operation non prise en charge");
        }

        let lien = process.env.URL_FRONT + "/" + paramUrl + "/" + hashTemporaire

        let dateExpiration = moment(Date.now()).add(30, 'm').toDate();

        let lienTemporaire = new LienTemp({
            dateExpiration: dateExpiration, hash: hashTemporaire,
            cibleId: cibleId, creePar: creePar, operation: operation
        })
        lienTemporaire.save()

        return lien
    } catch (error) {
        error.status = 500
        console.log(error);
        throw createError[500](`lien temp error` + error);
    }

}
async function CheckEtDeleteLienTemporaire(hash, operation) {
    try {
        let lienTemporaire = await LienTemp.findOne({ hash: hash })

        const lienAExpire = lienTemporaire?.dateExpiration < Date.now()
        if (!lienTemporaire || lienTemporaire.operation !== operation || lienAExpire) {
            return null
        }
        let cible = lienTemporaire.cibleId;

        await lienTemporaire.delete()
        return cible
    } catch (error) {
        error.status = 500
        console.log(error);
        throw createError[500](`lien temp error` + error);
    }
}