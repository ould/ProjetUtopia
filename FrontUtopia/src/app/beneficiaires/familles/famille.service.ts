import { Injectable } from '@angular/core';
import { Famille } from '../../interfaces/famille';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { FamillesMock } from './mock-familles';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {

  private familleUrl = 'api/familles';  // URL to web api (meme nom que database)

  searchFamilles(term: string): Observable<Famille[]> { //TODO : TOP 10 only, order by date desc
  if (!term.trim()) {
    // if not search term, return empty array.
    return of([]);
  }
  const famillesResult = FamillesMock.filter(h => h.nomFamille.startsWith(term))!;
  return of(famillesResult);
}

getFamille(id: number): Observable<Famille> {
  if (id === 0) {
    // if not search term, return empty array.
    return of();
  }
  const url = `${this.familleUrl}/${id}`;
  return this.http.get<Famille>(url).pipe(
    tap(_ => this.log(`fetched famille id=${id}`)),
    catchError(this.handleError<Famille>(`getFamille id=${id}`))
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
  
}

constructor(
  private http: HttpClient) { }
}
