function historique_ChercheChampsModifies(ancienObjet, nouveauObjet) {
    const champsModifies = [];
    if (ancienObjet && nouveauObjet) {
        Object.keys(ancienObjet.toObject()).forEach((key) => {
            if (ancienObjet["_id"] && ancienObjet[key] && nouveauObjet[key]) {
                if (String(ancienObjet[key]).replace(/['"]/g, '') !== String(nouveauObjet[key]).replace(/['"]/g, '')) {
                    if (key !== "dateCreation" && key !== "dateModification")
                        champsModifies.push({ objetId: ancienObjet["_id"], champ: key, ancienneValeur: ancienObjet[key], nouvelleValeur: nouveauObjet[key] });
                }
            }
        });
        return champsModifies;
    }
}

module.exports = {
    historique_ChercheChampsModifies
}