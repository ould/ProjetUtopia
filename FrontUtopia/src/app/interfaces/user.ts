export interface User {
    _id?:string;
    email:string;
    
    nom:string;
    prenom:string;
    password:string;

    antenneDefaut:string;

    antennes: string[];
    groupes: string[];
    droits: string[];
    token?:string;

}