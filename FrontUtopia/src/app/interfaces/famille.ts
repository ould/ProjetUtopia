import { Personne } from "src/app/interfaces/Personne";

export interface Famille {
    id: number;
    nomFamille: string;
    personnes : Personne[];
    composition: string;
    nationalite : string;
    commentaire: string;
}



