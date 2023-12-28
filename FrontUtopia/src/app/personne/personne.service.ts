import { Injectable } from '@angular/core';
import { Personne } from '../interfaces/Personne';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  private personneUrl = 'http://localhost:3000/personne';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

  getPersonne(id: string): Observable<Personne> {
    if (id === "") {
      // if not search term, return empty array.
      return of();
    }
    console.log("test")
    const url = `${this.personneUrl}/${id}`;
    const personne = this.http.get<Personne>(url).pipe(
      tap(_ => this.log(`fetched personne id=${id}`)),
      catchError(this.handleError<Personne>(`getPersonne id=${id}`))
      );
      console.log("teste")
  return personne
  
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }


  constructor(
    private http: HttpClient) { }
}
