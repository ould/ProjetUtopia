export interface Membre {
    _id?:string;
    type?: string;
    nom: string;
    prenom?: string;
    telephone?: string;
    ddn?: Date;
    nationalite?: string;
    situation?: string;
    procedure?: string;
    commentaire?: string;
    antenneId?: string;
    parentId?:string;
    
}
