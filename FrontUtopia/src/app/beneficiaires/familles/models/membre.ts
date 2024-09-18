export interface Membre {
    _id?:string;
    type?: string;
    nom: string;
    prenom?: string;
    telephone?: string;
    ddn?: String;
    nationalite?: string;
    situation?: string;
    procedure?: string;
    commentaire?: string;
    antenneId?: string;
    parentId?:string;
    
}
