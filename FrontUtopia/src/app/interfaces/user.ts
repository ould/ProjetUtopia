export interface User {
    _id?:string;
    email:string;
    
    nom?:string;
    prenom?:string;
    password?:string;

    groupes?: string[];
    token?:string;

}