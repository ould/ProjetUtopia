export interface Famille {
    _id?:string;
    nom: string;
    beneficiairesId: string[];
    composition?: string;
    commentaire?: string;
    antenneId?: string;
    dateCreation?:Date;
}