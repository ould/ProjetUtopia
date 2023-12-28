import { Personne } from "src/app/interfaces/Personne";

export interface Famille {
    familleId?:string;
    nomFamille: string;
    personnesId: string[];
    composition?: string;
    nationalite?: string;
    commentaire?: string;
}



