import { Message } from "./message";

export interface Chat {
    _id?:string;
    nom: string;
    messages:Message[]
    droitsLecture?:any;
    droitsEcriture?:any;
}
