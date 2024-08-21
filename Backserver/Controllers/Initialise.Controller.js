const createError = require('http-errors');
const Initialise = require('../Models/Initialise.model');
const Antenne = require('../Models/Antenne.model');
const User = require('../Models/User.model');
const Profil = require('../Models/Profil.model');

module.exports = {

  launch: async (req, res, next) => {
    try {
      console.log("Lancement..")
      const doesExist = await Initialise.findOne()
      if (!doesExist) { //TODO : sortir ce codes et voir ce qui peut etre async
        console.log("Initialisation..")

        const initialiseObjet = new Initialise({ lancePar: "Initialisation" });
        const userId = "Initialisation"
        // Efface les tables de parametrage
        Antenne.collection.drop();
        Profil.collection.drop();

        //Profils utilisateur (pole) => regroupe des droits utilisateurs pour un ou plusieurs Sections precedents (on peut en ajouter sans dev)
        //nom, userId,admin,famille,hebergeuse,benevole,adherente,mineur,hommeSeul,rapports,stock,chat
        const accesTotal = "carwd"
        await creationProfil(process.env.contexte_admin, userId, "Adminisatrateur general (acces complet à l'application)", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd");
        await creationProfil("Astreinte", userId, "Astreinte: lien entre famille et HC", "", "crwd", "crwd", "r", "", "crwd", "", "crwd", "", "crwd");
        await creationProfil("Famille", userId, "Acces famille", "", "crwd", "", "", "", "", "", "crwd", "", "crwd");
        await creationProfil("Hebergeuse", userId, "Compte hebergeuse", "", "", "crwd", "", "", "", "", "crwd", "", "crwd");
        await creationProfil("Benevole", userId, "Compte bénévole", "", "", "", "crwd", "", "", "", "crwd", "", "crwd");
        await creationProfil("Adherent", userId, "Compte adherent", "", "", "", "", "crwd", "", "", "crwd", "", "crwd");
        await creationProfil("Rapports", userId, "Acces restreint aux rapports et chat", "", "", "c", "", "", "", "", "crwd", "", "crwd");
        await creationProfil("Stock", userId, "Acces gestion stocks", "", "", "", "", "", "", "", "crwd", "crwd", "crwd");
        await creationProfil("Chat", userId, "Acces restreint chat", "", "", "", "", "", "", "", "", "", "crwd");
        Profil.collection.drop();

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
        await creationAntenne("Toutes", userId); // Permet de voir toutes les antennes (TODO : a implementer)
        await creationAntenne("Toutes", userId); // Permet de voir toutes les antennes (TODO : a implementer)


        // Fait de l'utilisteur un user admin
        console.log("Admin..")
        await createFirstAdmin();

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
      next(error)
    }
  },
}

async function creationProfil(nom, userId, commentaire, admin, famille, hebergeuse, benevole, adherente, mineur, hommeSeul, rapports, stock, chat) {
  try {
    const nouveauProfil = new Profil({
      nom: nom, creePar: userId, commentaire: commentaire,
      tableauDroits: [{ section: process.env.contexte_admin, droits: admin },
      { section: process.env.contexte_famille, droits: famille },
      { section: process.env.contexte_hebergeuse, droits: hebergeuse },
      { section: process.env.contexte_benevole, droits: benevole },
      { section: process.env.contexte_adherente, droits: adherente },
      { section: process.env.contexte_mineur, droits: mineur },
      { section: process.env.contexte_hommeSeul, droits: hommeSeul },
      { section: process.env.contexte_rapports, droits: rapports },
      { section: process.env.contexte_stock, droits: stock },
      { section: process.env.contexte_chat, droits: chat }]
    })
    const savedProfil = await nouveauProfil.save()
    console.log("Profil crée :" + savedProfil.nom)
  } catch (error) {
    throw createError[500](`Profile error` + error);
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
    throw createError[500](`Antenne error` + error);
  }
}

async function createFirstAdmin() {
  try {
    //Verifie s'il y'a un profil admin
    const profilAdmin = await Profil.findOne({ nom: process.env.contexte_admin});
    if (!profilAdmin)
      throw createError.NotFound(`Profil admin not found`);
    const profilAdminId = profilAdmin._id + "";

    //Met paris comme antenne par defaut
    const antennePrincipale = await Antenne.findOne({ nom: "Paris" });
    if (!antennePrincipale)
      throw createError.NotFound(`Antenne not found`);
    const idAntennePrincipale = antennePrincipale._id + "";

    //Creation utilisateur
    console.log("Creation admin.. ");
    let utilisateurExistant = await User.findOne({ email: "adminUtopia@test.fr" });
    if (!utilisateurExistant) {
      const user = new User({ email: "adminUtopia@test.fr", password: "123456789", nom: "admin", prenom: "utopia", antennes: [idAntennePrincipale], antenneDefautId: idAntennePrincipale, creePar: "Initialisation", derniereConnexion: null, derniereModificationMdp: null })
      await user.save() 
      utilisateurExistant = await User.findOne({ email: "adminUtopia@test.fr" });
      if (!utilisateurExistant)
        throw createError.NotFound(`user not found`);
    }
    console.log("Assignation droit admin.. ");
    utilisateurExistant.profilId = profilAdminId;

    const filter = { _id: utilisateurExistant._id };
    const updateduser = await User.findOneAndUpdate(filter, utilisateurExistant, {
      returnOriginal: false
    });

    console.log("Creation admin adminUtopia@test.fr 123456789 "); //TODO: mdp aléatoire
  } catch (error) {
    throw createError[500](`Admin error` + error);
  }
}

