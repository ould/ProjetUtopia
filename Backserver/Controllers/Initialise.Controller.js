const createError = require('http-errors');
const Initialise = require('../Models/Initialise.model');
const PersonneType = require('../Models/PersonneType.model');
const Groupe = require('../Models/Groupe.model');
const Antenne = require('../Models/Antenne.model');
const User = require('../Models/User.model');

module.exports = {

  launch: async (req, res, next) => {
    try {

      const userId = req.payload.userId;

      const doesExist = await Initialise.findOne()
      if (!doesExist) {
        console.log("Initialisation..")

        const initialiseObjet = new Initialise({ lancePar: userId });

        // Efface les tables de parametrage
        PersonneType.collection.drop();
        Groupe.collection.drop();
        Antenne.collection.drop();

        // Ajoute les groupes (qui a droit à acceder à quoi) : souvent le champ d'application d'un pole
        await creationGroupe("Admin", userId);
        await creationGroupe("Famille", userId);
        await creationGroupe("Hebergeuse", userId);
        await creationGroupe("Astreinte", userId);
        await creationGroupe("Benevole", userId);
        await creationGroupe("Adherent", userId);
        await creationGroupe("Mineur", userId);
        await creationGroupe("HommeSeul", userId);
        await creationGroupe("Rapports", userId);
        await creationGroupe("Stock", userId);
        await creationGroupe("Chat", userId);
        //Groupes spécifiques pour la gestion des données
        await creationGroupe("LectureSeule", userId);
        await creationGroupe("AjoutSeul", userId);
        await creationGroupe("DroitSuppression", userId);

        // Fait de l'utilisteur un user admin
        await updateAdmin(userId);

        //Ajoute les Antennes
        await creationAntenne("Paris", userId);
        await creationAntenne("Lille", userId);
        await creationAntenne("GS", userId);
        await creationAntenne("Tours", userId);
        await creationAntenne("Rennes", userId);
        await creationAntenne("Toulouse", userId);
        await creationAntenne("Calais", userId);
        await creationAntenne("Dijon", userId);
        await creationAntenne("Lorient", userId);
        await creationAntenne("Autre", userId);

        // Ajoute les types de personne : personne pouvant avoir une fiche détaillée dans l'application
        await creationType("Famille", userId);
        await creationType("Mineur", userId);
        await creationType("Hebegeuse", userId);
        await creationType("Benevole", userId);
        await creationType("Adherent", userId);

        // Ajoute une ligne dans initialisation
        await initialiseObjet.save();

      } else {
        console.log("??");
        // Ajoute une ligne dans initialisation et envoi alerte 
        const initialiseObjetEssai = new Initialise({ lancePar: userId });
        await initialiseObjetEssai.save();
      }

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },


  exist: async (req, res, next) => {
    try {
      const doesExist = await Initialise.findOne()
      console.log(doesExist)
      if (doesExist)
        res.send(true)
      else
        res.send(false)

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
}


async function creationGroupe(nom, userId) {
  try {
    const groupeAChek = await Groupe.findOne({ nom: nom });
    const user = await User.findOne({ _id: userId });

    if (!groupeAChek && user) {
      const groupe = new Groupe({ nom: nom, creePar: userId })
      const savedGroupe = await groupe.save()
      console.log("groupe crée :" + savedGroupe.nom)
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    throw createError[500](`Groupe error` + error);
  }
}

async function creationAntenne(nom, userId) {
  try {
    const antenneAChek = await Antenne.findOne({ nom: nom });
    const user = await User.findOne({ _id: userId });

    if (!antenneAChek && user) {
      const antenne = new Antenne({ nom: nom, creePar: userId });
      const savedAntenne = await antenne.save();
      console.log("antenne crée :" + savedAntenne.nom);

    }

  } catch (error) {
    if (error.isJoi === true) error.status = 422
    throw createError[500](`Antenne error` + error);
  }
}

async function creationType(nom, userId) {
  try {
    const typeAChek = await PersonneType.findOne({ nom: nom });
    const user = await User.findOne({ _id: userId });

    if (!typeAChek && user) {
      const type = new PersonneType({ nom: nom, creePar: userId });
      const savedType = await type.save();
      console.log("type crée :" + savedType.nom);

    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    throw createError[500](`Type error` + error);
  }
}


async function updateAdmin(userId) {
  try {
    //Verifie s'il y'a un groupe admin
    const groupeAdmin = await Groupe.findOne({ nom: "Admin" });
    if (!groupeAdmin)
      throw createError.NotFound(`Admin not found`);
    const idAdmin = groupeAdmin._id + "";

    //Verifie s'il y'a un groupe Suppression
    const groupeSup = await Groupe.findOne({ nom: "DroitSuppression" });
    if (!groupeSup)
      throw createError.NotFound(`Sup group not found`);
    const idSup = groupeSup._id + "";

    //Verifie que le futur admin existe deja
    const doesExist = await User.findOne({ _id: userId });
    if (!doesExist)
      throw createError.NotFound(`${userId} not found`);


    doesExist.groupes = [idAdmin, idSup];

    const filter = { _id: userId };
    const updateduser = await User.findOneAndUpdate(filter, doesExist, {
      returnOriginal: false
    });

    console.log(updateduser.prenom + " devient " + groupeAdmin.nom);
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    throw createError[500](`Admin error` + error);
  }
}

