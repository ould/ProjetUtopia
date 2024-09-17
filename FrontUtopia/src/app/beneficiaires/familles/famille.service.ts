import { Injectable } from '@angular/core';
import { Famille } from './models/famille';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Membre } from './models/membre';
import { LoggerService } from 'src/app/autres-services/logger/logger.service';

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
      catchError(this.logger.handleError<Famille>(`getFamille id=${id}`))
    );
  }

  /** POST: add  Famille */
  addFamille(famille: Famille): Observable<string> {
    return this.http.post<string>(this.familleUrl, famille, this.httpOptions).pipe(
      catchError(this.logger.handleError<string>('addFamille'))
    );
  }

  /** PUT: update Famille */
  updateFamille(Famille: Famille): Observable<string> {
    return this.http.put<string>(this.familleUrl, Famille, this.httpOptions).pipe(
      catchError(this.logger.handleError<string>('updateFamille'))
    );
  }

  /** DELETE: delete Famille*/
  deleteFamille(id: number): Observable<string> {
    const url = `${this.familleUrl}/${id}`;
    return this.http.delete<string>(url, this.httpOptions).pipe(
      catchError(this.logger.handleError<string>('deleteFamille'))
    );
  }

  searchFamilles(term: string): Observable<Famille[]> { //TODO : TOP 10 only, order by date desc
    if (!term.trim()) {
      // if not search term, return empty array.
      return of([]);
    }
    const url = `${this.familleUrl}`;
    return this.http.get<Famille[]>(`${url}/search/${term}`).pipe(
      catchError(this.logger.handleError<Famille[]>('searchFamilles', []))
    );
  }


  getMembre(id: string): Observable<Membre> {
    const url = `${this.membreFamilleUrl}/${id}`;
    return this.http.get<Membre>(url).pipe(
      catchError(this.logger.handleError<Membre>(`getMembre id=${id}`))
    );
  }

  getMembres(ids: string[]): Observable<Membre[]> {
    const requests = ids.map(id => this.http.get<Membre>(`${this.membreFamilleUrl}/${id}`));
    return forkJoin(requests).pipe(
      catchError(this.logger.handleError<Membre[]>('getMembres'))
    );
  }

  addMembre(membre: Membre): Observable<string> {
    return this.http.post<string>(this.membreFamilleUrl, membre, this.httpOptions).pipe(
      catchError(this.logger.handleError<string>('addMembre'))
    );
  }

  //-----------------------------------
  updateMembre(membre: Membre): Observable<string> {
    return this.http.put<string>(this.membreFamilleUrl, membre, this.httpOptions).pipe(
      catchError(this.logger.handleError<string>('updateMembre'))
    );
  }

  saveOrUpdateMembres(membres: Membre[]): Observable<string[]> {
    // Séparer les membres à mettre à jour et ceux à ajouter
    const membresAUpdate = membres.filter((membre): membre is Membre => membre._id !== undefined && membre.nom !== "Suppression");
    const membresASupprimer = membres.filter((membre): membre is Membre => membre._id !== undefined && membre.nom === "Suppression");
    const membresASauver = membres.filter((membre): membre is Membre => membre._id === undefined);

    // Création des Observables pour les POST et PUT
    const saveRequests = membresASauver.map(membre => this.addMembre(membre));
    const updateRequests = membresAUpdate.map(membre => this.updateMembre(membre));
    const deleteRequests = membresASupprimer.map(membre => this.deleteMembre(membre._id || ""));

    // Combine les Observables avec forkJoin
    return forkJoin([...saveRequests, ...updateRequests, ...deleteRequests]).pipe(
      map(responses => responses as string[]),  // Assume que toutes les réponses sont des IDs string
      catchError(this.logger.handleError<string[]>('saveOrUpdateMembres'))
    );
  }

  deleteMembre(id: string): Observable<string> {
    const url = `${this.membreFamilleUrl}/${id}`;
    return this.http.delete<string>(url, this.httpOptions).pipe(
      catchError(this.logger.handleError<string>('deleteMembre'))
    );
  }

  getReferentielByNom(nom: string): Observable<string[]> {
    const url = `${this.familleUrl}/getReferentielByNom/${nom}`;
    return this.http.get<string[]>(url).pipe(
      catchError(this.logger.handleError<string[]>(`referentiel not found ${nom}`))
    );
  }

  constructor(
    private http: HttpClient,
    private logger: LoggerService) { }
}
