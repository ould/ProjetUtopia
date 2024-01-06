export interface User {
    id?:string;
    email:string;
    
    nom?:string;
    prenom?:string;
    password?:string;

    droits?: string[];
    token?:string;

}