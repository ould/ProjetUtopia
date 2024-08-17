export interface Membre {
    _id?:string;
    type: string;
    nom: string;
    prenom?: string;
    telephone?: string;
    ddn?: string;
    nationalite?: string;
    situation?: string;
    procedure?: string;
    commentaire?: string;
    antenne?: string;
    parentId?:string;
    
}
