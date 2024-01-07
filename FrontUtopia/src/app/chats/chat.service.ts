import { Injectable } from '@angular/core';
import { Chat } from '../interfaces/chat';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatUrl = 'http://localhost:3000/chat';
  private messageUrl = 'http://localhost:3000/message';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

  
  searchChats(term: string): Observable<Chat[]> { 
    return this.http.get<Chat[]>(this.chatUrl + "/search/" + term, this.httpOptions).pipe(
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
