import { Injectable } from '@angular/core';
import { Chat } from '../interfaces/chat';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatUrl = 'api/chats';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  searchChats(): Observable<Chat[]> { 
    return this.http.get<Chat[]>(this.chatUrl, this.httpOptions).pipe(
    );
  }

  getChat(idChat : number):Observable<Chat> {
    if (idChat === 0) {
      // if not search term, return empty array.
      return of();
    }
    const url = `${this.chatUrl}/${idChat}`;
    return this.http.get<Chat>(url).pipe();
  }

  constructor( private http: HttpClient) { }
}
