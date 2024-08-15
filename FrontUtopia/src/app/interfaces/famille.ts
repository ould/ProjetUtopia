import { Personne } from "src/app/interfaces/Personne";

export interface Famille {
    _id?:string;
    nomFamille: string;
    personnesId: string[];
    composition?: string;
    commentaire?: string;
    antenne?: string;
}



