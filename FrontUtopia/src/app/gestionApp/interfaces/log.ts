export interface Log {
    _id?:string;
    type: string;
    application?:string;
    message: any;
    utilisateurId?:string;
    date?:Date;
}
