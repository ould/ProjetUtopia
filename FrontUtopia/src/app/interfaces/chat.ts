import { Message } from "./message";

export interface Chat {
    id:number;
    nomChat: string;
    messages:Message[]
    droitsLecture?:any;
    droitsEcriture?:any;
}
