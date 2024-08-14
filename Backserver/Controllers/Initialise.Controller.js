const createError = require('http-errors');
const Initialise = require('../Models/Initialise.model');
const PersonneType = require('../Models/PersonneType.model');
const Groupe = require('../Models/Groupe.model');
const Antenne = require('../Models/Antenne.model');
const User = require('../Models/User.model');
const Droit = require('../Models/Droit.model');

module.exports = {

  launch: async (req, res, next) => {
    try {
      console.log("Lancement..")
      const doesExist = await Initialise.findOne()
      if (!doesExist) { //TODO : sortir ce codes et voir ce qui peut etre async
        console.log("Initialisation..")

        const initialiseObjet = new Initialise({lancePar : "Initialisation"});
        const userId = "Initialisation"
        // Efface les tables de parametrage
        PersonneType.collection.drop();
        Groupe.collection.drop();
        Antenne.collection.drop();

        // Ajoute les groupes (qui a droit à acceder à quoi) : souvent le champ d'application d'un pole
        console.log("Groupe..")
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
        console.log("Droits..")
        await creationDroit("Lecture", userId);
        await creationDroit("Modification", userId);
        await creationDroit("Ajout", userId); //Décorrellé de la lecture car peut etre bénévole temporaire qui doit ajouter sans voir ce qui l'est deja 
        await creationDroit("Suppression", userId);
        await creationDroit("Admin", userId);


        //Ajoute les Antennes
        console.log("Antenne..")
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


        // Fait de l'utilisteur un user admin
        console.log("Admin..")
        await createFirstAdmin();


        // Ajoute les types de personne : personne pouvant avoir une fiche détaillée dans l'application
        console.log("Type..")
        await creationType("Famille", userId);
        await creationType("Mineur", userId);
        await creationType("Hebegeuse", userId);
        await creationType("Benevole", userId);
        await creationType("Adherent", userId);


        // Ajoute une ligne dans initialisation
        console.log("Finalisation..")
        await initialiseObjet.save();

      } else {
        console.log("??");
        // TODO Ajoute un et envoi alerte 
      }

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },


  exist: async (req, res, next) => {
    try {
      const doesExist = await Initialise.findOne()
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

    if (!groupeAChek) {
      const groupe = new Groupe({ nom: nom, creePar: userId })
      const savedGroupe = await groupe.save()
      console.log("groupe crée :" + savedGroupe.nom)
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    throw createError[500](`Groupe error` + error);
  }
}

async function creationDroit(nom, userId) {
  try {
    const droitExiste = await Droit.findOne({ nom: nom });

    if (!droitExiste) {
      const droit = new Droit({ nom: nom, creePar: userId })
      const savedDroit = await droit.save()
      console.log("Droit crée :" + savedDroit.nom)
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    throw createError[500](`Droit error` + error);
  }
}

async function creationAntenne(nom, userId) {
  try {
    const antenneAChek = await Antenne.findOne({ nom: nom });

    if (!antenneAChek) {
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

    if (!typeAChek) {
      const type = new PersonneType({ nom: nom, creePar: userId });
      const savedType = await type.save();
      console.log("type crée :" + savedType.nom);

    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    throw createError[500](`Type error` + error);
  }
}


async function createFirstAdmin() {
  try {
    //Verifie s'il y'a un groupe admin
    const groupeAdmin = await Groupe.findOne({ nom: "Admin" });
    if (!groupeAdmin)
      throw createError.NotFound(`Admin not found`);
    const idGroupeAdmin = groupeAdmin._id + "";

    //Verifie s'il y'a un droit admin
    const droitAdmin = await Droit.findOne({ nom: "Admin" });
    if (!droitAdmin)
      throw createError.NotFound(`droit admin not found`);
    const idDroitAdmin = droitAdmin._id + "";

    //Met paris comme antenne par defaut
    const antennePrincipale = await Antenne.findOne({ nom: "Paris" });
    if (!antennePrincipale)
      throw createError.NotFound(`Antenne not found`);
    const idAntennePrincipale = antennePrincipale._id + "";

    //Creation utilisateur
    console.log("Creation admin.. ");
    let doesExist = await User.findOne({ email: "adminUtopia@test.fr" });
    if (!doesExist){
      const user = new User({email : "adminUtopia@test.fr", password : "123456789", nom: "admin", prenom: "utopia", antennes:[idAntennePrincipale], antenneDefaut: idAntennePrincipale, creePar:"Initialisation" })
      const saveduser = await user.save()   
      doesExist = await User.findOne({ email: "adminUtopia@test.fr" });
      if (!doesExist)
        throw createError.NotFound(`user not found`);
    }
    console.log("Assignation droit et groupe admin.. ");
    //Ajoute les droits et groupes
    doesExist.groupes = [idGroupeAdmin];
    doesExist.droits = [idDroitAdmin];

    const filter = { _id: doesExist._id };
    const updateduser = await User.findOneAndUpdate(filter, doesExist, {
      returnOriginal: false
    });

    console.log("Creation admin adminUtopia@test.fr 123456789 "); //TODO: mdp aléatoire
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    throw createError[500](`Admin error` + error);
  }
}

