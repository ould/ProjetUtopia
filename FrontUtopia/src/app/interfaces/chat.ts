import { Message } from "./message";

export interface Chat {
    _id?:string;
    nom: string;
    messages:Message[];
    antenne: string;
    droitsLecture?:any;
    droitsEcriture?:any;
}
