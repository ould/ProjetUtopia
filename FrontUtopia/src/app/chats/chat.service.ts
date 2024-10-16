import { Injectable } from '@angular/core';
import { Chat } from '../gestionApp/interfaces/chat';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoggerService } from '../autres-services/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatUrl = environment.apiUrl + 'chat';
  private messageUrl = environment.apiUrl + 'message';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*' })
  };

  search(term: string): Observable<Chat[]> { //TODO : TOP 10 only, order by date desc
    if (!term.trim()) {
      // if not search term, return empty array.
      return of([]);
    }
    return this.http.get<Chat[]>(this.chatUrl + "/search/" + term, this.httpOptions).pipe(
      catchError(this.logger.handleError<Chat[]>('searchChats'))
    );
  }

  get(idChat : string):Observable<Chat> {
    if (!idChat) {
      // if not search term, return empty array.
      return of();
    }
    const url = `${this.chatUrl}/${idChat}`;
    return this.http.get<Chat>(url).pipe(
      catchError(this.logger.handleError<Chat>('getChat'))
    );
  }

  add(newChat: Chat): Observable<Chat> {
    return this.http.post<Chat>(this.chatUrl, newChat, this.httpOptions).pipe(
      catchError(this.logger.handleError<Chat>('addChat'))
    );
  }

  update(Chat: Chat): Observable<any> {
    return this.http.put(this.chatUrl, Chat, this.httpOptions).pipe(
      catchError(this.logger.handleError<any>('updateChat'))
    );
  }

  delete(id: number): Observable<Chat> {
    const url = `${this.chatUrl}/${id}`;

    return this.http.delete<Chat>(url, this.httpOptions).pipe(
      catchError(this.logger.handleError<Chat>('deleteChat'))
    );
  }

  constructor( private http: HttpClient,
    private logger: LoggerService
  ) { }
}
