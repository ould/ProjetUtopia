import { Injectable } from '@angular/core';
import { Chat } from '../interfaces/chat';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatUrl = environment.apiUrl + 'chat';
  private messageUrl = environment.apiUrl + 'message';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*' })
  };

  
  searchChats(term: string): Observable<Chat[]> { 
    return this.http.get<Chat[]>(this.chatUrl + "/search/" + term, this.httpOptions).pipe(
    );
  }

  searchFamilles(term: string): Observable<Chat[]> { //TODO : TOP 10 only, order by date desc
    if (!term.trim()) {
      // if not search term, return empty array.
      return of([]);
    }
    return this.http.get<Chat[]>(this.chatUrl + "/search/" + term, this.httpOptions).pipe(
      tap(x => x.length ?
        this.log(`found famille matching "${term}"`) :
        this.log(`no famille matching "${term}"`)),
        tap(x => this.log(` "${x[0]._id}"`)),
      catchError(this.handleError<Chat[]>('searchChats', []))
    );
  }

  getChat(idChat : string):Observable<Chat> {
    if (!idChat) {
      // if not search term, return empty array.
      return of();
    }
    const url = `${this.chatUrl}/${idChat}`;
    return this.http.get<Chat>(url).pipe();
  }

  addChat(newChat: Chat): Observable<Chat> {
    return this.http.post<Chat>(this.chatUrl, newChat, this.httpOptions).pipe(
      catchError(this.handleError<Chat>('addChat'))
    );
  }

  updateFamille(Chat: Chat): Observable<any> {
    return this.http.put(this.chatUrl, Chat, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateChat'))
    );
  }

  deleteFamille(id: number): Observable<Chat> {
    const url = `${this.chatUrl}/${id}`;

    return this.http.delete<Chat>(url, this.httpOptions).pipe(
      catchError(this.handleError<Chat>('deleteChat'))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for uti consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }

  constructor( private http: HttpClient) { }
}
