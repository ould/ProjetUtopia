export interface Profil {
    _id?: string;
    nom: string;
    commentaire?: string;
    tableauDroits:Droit[],
    creePar?: string,
    dateCreation?: Date,
    dateModification?: Date,
    modifiePar?: string
}

export interface Droit {
    section: string;
    droits: string;
  }
