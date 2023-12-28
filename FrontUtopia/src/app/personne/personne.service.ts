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
    const url = `${this.personneUrl}/${id}`;
    const personne = this.http.get<Personne>(url).pipe(
      tap(_ => this.log(`fetched personne id=${id}`)),
      catchError(this.handleError<Personne>(`getPersonne id=${id}`))
    );
    return personne
  }

  addPersonne(Personne: Personne): Observable<Personne> {
    return this.http.post<Personne>(this.personneUrl, Personne, this.httpOptions).pipe(
      tap((newper: Personne) => this.log(`add personne id=${newper.nom}`)),
      catchError(this.handleError<any>('addPersonne'))
    );
  }

  updatePersonne(Personne: Personne): Observable<Personne> {
    return this.http.put<Personne>(this.personneUrl, Personne, this.httpOptions).pipe(
      tap(_ => this.log(`updated personne id=${_.nom}`)),
      catchError(this.handleError<any>('updatePersonne'))
    );
  }

  deletePersonne(id: string): Observable<Personne> {
    const url = `${this.personneUrl}/${id}`;
    return this.http.delete<Personne>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Famille id=${id}`)),
      catchError(this.handleError<Personne>('deletePersonne'))
    );
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
