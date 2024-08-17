export interface Utilisateur {
    _id?:string;
    email:string;
    
    nom:string;
    prenom:string;
    password:string;
    
    profilId?: string;
    
    antenneDefautId:string;
    antennes: string[];
    token?:string;

}