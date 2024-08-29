import { Injectable } from '@angular/core';
import { Famille } from './models/famille';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Membre } from './models/membre';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {


  private familleUrl = environment.apiUrl + 'famille';  // URL to web api (meme nom que section)
  private membreFamilleUrl = this.familleUrl + '/membre';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };
  //If you neglect to subscribe(), the service can't send the request to the server. As a rule, an Observable does nothing until something subscribes.
  getFamille(id: string): Observable<Famille> {
    const url = `${this.familleUrl}/${id}`;
    return this.http.get<Famille>(url).pipe(
      catchError(this.handleError<Famille>(`getFamille id=${id}`))
    );
  }

  /** POST: add  Famille */
  addFamille(famille: Famille): Observable<string> {
    return this.http.post<string>(this.familleUrl, famille, this.httpOptions).pipe(
      catchError(this.handleError<string>('addFamille'))
    );
  }

  /** PUT: update Famille */
  updateFamille(Famille: Famille): Observable<string> {
    return this.http.put<string>(this.familleUrl, Famille, this.httpOptions).pipe(
      catchError(this.handleError<string>('updateFamille'))
    );
  }

  /** DELETE: delete Famille*/
  deleteFamille(id: number): Observable<string> {
    const url = `${this.familleUrl}/${id}`;
    return this.http.delete<string>(url, this.httpOptions).pipe(
      catchError(this.handleError<string>('deleteFamille'))
    );
  }

  searchFamilles(term: string): Observable<Famille[]> { //TODO : TOP 10 only, order by date desc
    if (!term.trim()) {
      // if not search term, return empty array.
      return of([]);
    }
    const url = `${this.familleUrl}`;
    return this.http.get<Famille[]>(`${url}/search/${term}`).pipe(
      catchError(this.handleError<Famille[]>('searchFamilles', []))
    );
  }


  getMembre(id: string): Observable<Membre> {
    const url = `${this.membreFamilleUrl}/${id}`;
    return this.http.get<Membre>(url).pipe(
      catchError(this.handleError<Membre>(`getMembre id=${id}`))
    );
  }

  getMembres(ids: string[]): Observable<Membre[]> {
    const requests = ids.map(id => this.http.get<Membre>(`${this.membreFamilleUrl}/${id}`));
    return forkJoin(requests);
  }

  addMembre(membre: Membre): Observable<string> {
    return this.http.post<string>(this.membreFamilleUrl, membre, this.httpOptions).pipe(
      catchError(this.handleError<string>('addMembre'))
    );
  }

  //-----------------------------------
  updateMembre(membre: Membre): Observable<string> {
    return this.http.put<string>(this.membreFamilleUrl, membre, this.httpOptions).pipe(
      catchError(this.handleError<string>('updateMembre'))
    );
  }

  saveOrUpdateMembres(membres: Membre[]): Observable<string[]> {
    console.log(membres)
    // Séparer les membres à mettre à jour et ceux à ajouter
    const membresAUpdate = membres.filter((membre): membre is Membre => membre._id !== undefined);
    const membresASauver = membres.filter((membre): membre is Membre => membre._id === undefined);

    // Création des Observables pour les POST et PUT
    const saveRequests = membresASauver.map(membre => this.http.post<string>(`${this.membreFamilleUrl}`, membre));
    const updateRequests = membresAUpdate.map(membre => this.http.put<string>(`${this.membreFamilleUrl}`, membre));

    // Combine les Observables avec forkJoin
    return forkJoin([...saveRequests, ...updateRequests]).pipe(
      map(responses => responses as string[]) // Assume que toutes les réponses sont des IDs
    );
  }

  deleteMembre(id: string): Observable<string> {
    const url = `${this.membreFamilleUrl}/${id}`;
    return this.http.delete<string>(url, this.httpOptions).pipe(
      catchError(this.handleError<string>('deleteMembre'))
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

  constructor(
    private http: HttpClient) { }
}
