const createError = require('http-errors');
const Initialise = require('../Models/Initialise.model');
const Antenne = require('../Models/Antenne.model');
const User = require('../Models/User.model');
const Profil = require('../Models/Profil.model');
const Referentiel = require('../Models/Referentiel.model');

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
        Referentiel.collection.drop()

        //Profils utilisateur (pole) => regroupe des droits utilisateurs pour un ou plusieurs Sections precedents (on peut en ajouter sans dev necessaires)
        console.log("Profil..")
        const accesTotal = "carwd"
        await creationProfil(process.env.contexte_admin, userId, "Adminisatrateur general (acces complet à l'application)", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd", "carwd");
        await creationProfil("Astreinte", userId, "Astreinte: lien entre famille et HC", "", "crwd", "crwd", "r", "", "crwd", "", "crwd", "", "crwd", "crwd");
        await creationProfil("Famille", userId, "Acces famille", "", "crwd", "", "", "", "", "", "crwd", "", "crwd", "");
        await creationProfil("Hebergeuse", userId, "Compte hebergeuse", "", "", "crwd", "", "", "", "", "crwd", "", "crwd", "");
        await creationProfil("Benevole", userId, "Compte bénévole", "", "", "", "crwd", "", "", "", "crwd", "", "crwd", "");
        await creationProfil("Adherent", userId, "Compte adherent", "", "", "", "", "crwd", "", "", "crwd", "", "crwd", "");
        await creationProfil("Reporting", userId, "Acces restreint aux rapports et chat", "", "", "c", "", "", "", "", "crwd", "", "crwd", "");
        await creationProfil("Stock", userId, "Acces gestion stocks", "", "", "", "", "", "", "", "crwd", "crwd", "crwd", "");
        await creationProfil("Chat", userId, "Acces restreint chat", "", "", "", "", "", "", "", "", "", "crwd", "");
        await creationProfil("Basique", userId, "Acces accueil", "", "", "", "", "", "", "", "", "", "", "");

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

        console.log("Referentiel..")
        await creationReferentiel("Pays", userId, pays, null,null);
        await creationReferentiel("Langues", userId, langues, null,null);
        await creationReferentiel("Procedure", userId, procedureFamille, process.env.contexte_famille, "Paris");
        await creationReferentiel("PaysDublin", userId, paysDublin, null, null);
        await creationReferentiel("Composition", userId, compositionFamille, process.env.contexte_famille, "Paris");
        await creationReferentiel("Vulnerabilite", userId, vulnerabiliteFamille, process.env.contexte_famille, "Paris");
        await creationReferentiel("Source", userId, familleSource, process.env.contexte_famille, "Paris");
        await creationReferentiel("LieuDodo", userId, lieuFamilleDodo, process.env.contexte_famille, "Paris");

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

async function creationProfil(nom, userId, commentaire, admin, famille, hebergeuse, benevole, adherente, mineur, hommeSeul, reporting, stock, chat, astreinte) {
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
      { section: process.env.contexte_reporting, droits: reporting },
      { section: process.env.contexte_stock, droits: stock },
      { section: process.env.contexte_chat, droits: chat },
      { section: process.env.contexte_astreinte, droits: astreinte },
      { section: process.env.contexte_accueil, droits: "crwd" }],
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
    const profilAdmin = await Profil.findOne({ nom: process.env.contexte_admin });
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

async function creationReferentiel(nom, userId, tableau, entitee, nomAntenne) {
  try {
    const referentiel = await Referentiel.findOne({ nom: nom });

    if (!referentiel) {
      const antenneId = await getAntenneIdByNom(nomAntenne);
      const nouveauReferentiel = new Referentiel({ nom: nom, creePar: userId, donnees: tableau, entitee:entitee, antenneId:antenneId });
      const savedRef = await nouveauReferentiel.save();
      console.log("Referentiel crée :" + savedRef.nom);
    }
  } catch (error) {
    throw createError[500](`Referentiel error` + error);
  }
}

async function getAntenneIdByNom(nom) {
  try {
    if(!nom) return null
    const antenne = await Antenne.findOne({ nom: nom });
    if (!antenne) {
      throw createError[500](`antenne get id error` + error);
    }
    return antenne?._id
  } catch (error) {
    throw createError[500](`antenne get id error` + error);
  }
}



const pays = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. \"Swaziland\")", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"]

const langues = ["akan", "allemand", "amharique", "anglais", "arabe", "assamais", "awadhi", "azéri", "bengali", "bhojpouri", "birman", "chewa (nyanja)", "chhattisgarhi", "chinois cantonais", "chinois gan", "chinois hakka", "chinois jing", "chinois mandarin", "chinois min", "chinois min bei", "chinois wu", "chinois xiang", "chinois zhouang", "chittagonien", "coréen", "créole haïtien", "deccan", "espagnol", "filipino (tagalog)", "français", "géorgien", "grec", "gujarati", "haoussa", "haryanvi", "hindi /ourdou", "hongrois", "igbo (ibo)", "italien", "japonais", "javanais", "kannada", "kazakh", "khmer", "kurde", "madourais", "magahi", "maithili", "malais", "malayalam", "malgache", "marathi", "marwari", "néerlandais", "oriya (odiya)", "oromo", "ouzbek", "pachtou", "panjabi", "persan", "peul / pular", "polonais", "portugais", "roumain", "russe", "saraiki", "sindhi", "somali", "soundanais", "sylheti", "tamoul", "tchèque", "télougou", "thaï", "tigrigna", "turc", "turkmène", "ukrainien", "vietnamien", "visayan (cibuano)", "yorouba", "zoulou", "dari", "farsi", "soniké", "ourdou", "bambara", "djoula", "sousou", "woloff", "mandinka", "malinke", "albanais", "lingala", "krio", "koyaka/koyaga", "zarma", "tama"]

const procedureFamille = ["Débouté", "Inconnue", "Mixte", "Primo", "Procédure Accélérée", "Procédure Dublin", "Procédure Normale", "Protection subsidiaire", "Réfugié Statutaire", "Sans Papier", "Titre de séjour", "Dublin en fuite", "Réexamen", "Passeport UE", "En demande de titre de séjour", "Regroupement familial"]

const paysDublin = ["Allemagne", "Autre", "Autriche", "Belgique", "Bulgarie", "Chypre", "Croatie", "Danemark", "Espagne", "Estonie", "Finlande", "France", "Grèce", "Hongrie", "Irlande", "Islande", "Italie", "Lettonie", "Liechtenstein", "Lituanie", "Luxembourg", "Malte", "Norvège", "Pays-Bas", "Pologne", "Portugal", "République tchèque", "Roumanie", "Royaume-Uni", "Slovaquie", "Slovénie", "Suède"]

const compositionFamille = ["Couple", "Famille", "Femme seule", "Monoparentale femme", "Monoparentale homme"]

const vulnerabiliteFamille = ["Femme enceinte", "Enfant(s) malade(s)", "Adulte(s) malade(s)", "Analphabétisme", "Handicap", "Personne(s) agée(s)", "Problèmes psychologiques", "Victime de violence (VVS / VG)", "LGBTI"]

const familleSource = ["115", "Accueil de jour", "Bouche à Oreille", "Maraude d'une autre asso", "Maraude utopia", "Watizat"]

const lieuFamilleDodo = ["Logement individuel","Proches","115","Centre d'hébergement (à préciser)","Rue, Gare...","Autre (squat, bidon ville)","Arrivé hier"]


