export interface Referentiel {
    _id?: string; 
    nom: string;
    donnees?: string[]; 
    antenneId?: string; 
    nomAntenne?: string; 
    entitee?:string;
    creePar?: string;
    dateCreation?: Date; 
    dateModification?: Date; 
    modifiePar?: string; 
  }