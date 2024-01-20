import { Injectable } from '@angular/core';
import { Personne } from '../interfaces/Personne';
import { Observable, forkJoin, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { identifierName } from '@angular/compiler';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  private personneUrl = environment.apiUrl +'personne';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  })
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

  addPersonne(Personne: Personne): Observable<string> {
    return this.http.post<Personne>(this.personneUrl, Personne, this.httpOptions).pipe(
      tap((newper: Personne) => this.log(`add personne id=${newper.id}`)),
      catchError(this.handleError<any>('addPersonne'))
    );
  }

  updatePersonne(Personne: Personne): Observable<string> {
    return this.http.put<Personne>(this.personneUrl, Personne, this.httpOptions).pipe(
      tap(_ => this.log(`updated personne id=${_.nom}`)),
      catchError(this.handleError<any>('updatePersonne'))
    );
  }

  addOrUpdate(pers: Personne): Observable<string> {
    if (!pers.id) {
      return this.addPersonne(pers);
    }
    else {
      const doesExist = this.getPersonne(pers.id);
      if (doesExist) {
        return this.updatePersonne(pers);
      }
      else {
        this.handleError<any>('addOrUpdate Famille: ' + pers.id)
        return doesExist
      }
    }
  }

  addOrUpdateAll(pers: Personne[]): Observable<string[]> {
    let personObservables: Observable<string>[] = [];
    const ee = pers.forEach(personne => {

      personObservables.push(this.addOrUpdate(personne))

    })

    return forkJoin(personObservables)

    //TODO delete personne si erreur 
  }

  deletePersonne(id: string): Observable<Personne> {
    const url = `${this.personneUrl}/${id}`;
    return this.http.delete<Personne>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Personne id=${_.id}`)),
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
