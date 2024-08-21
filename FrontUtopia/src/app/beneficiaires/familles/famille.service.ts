import { Injectable } from '@angular/core';
import { Famille } from './models/famille';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Membre } from './models/membre';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {

  private familleUrl = environment.apiUrl + 'famille';  // URL to web api (meme nom que section)
  private membreFamilleUrl = this.familleUrl + '/membre';  // URL to web api (meme nom que section)

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*' })
  };

  getFamille(id: string): Observable<Famille> {
    if (id === "") {
      // if not search term, return empty array.
      return of();
    }
    const url = `${this.familleUrl}/${id}`;
    return this.http.get<Famille>(url).pipe(
      tap(_ => this.log(`fetched famille id=${id}`)),
      catchError(this.handleError<Famille>(`getFamille id=${id}`))
    );
  }

  /** POST: add a new Famille to the server */
  addFamille(Famille: Famille): Observable<Famille> {
    return this.http.post<Famille>(this.familleUrl, Famille, this.httpOptions).pipe(
      tap((newFamille: Famille) => this.log(`added Famille w/ id=${newFamille._id}`)),
      catchError(this.handleError<Famille>('addFamille'))
    );
  }


  /** PUT: update the Famille on the server */
  updateFamille(Famille: Famille): Observable<any> {
    return this.http.put(this.familleUrl, Famille, this.httpOptions).pipe(
      tap(_ => this.log(`updated Famille id=${Famille._id}`)),
      catchError(this.handleError<any>('updateFamille'))
    );
  }

  addOrUpdate(fam: Famille): Observable<any> {
    if (!fam._id) {
      return this.addFamille(fam);
    }
    else {
      const doesExist = this.getFamille(fam._id);
      if (doesExist) {
        return this.updateFamille(fam);
      }
      else {
        this.handleError<any>('addOrUpdate Famille : ' + fam._id)
        return doesExist
      }
    }
    //TODO : faire monter l'erreur à l'utilisteur 

  }

  /** DELETE: delete the Famille from the server */
  deleteFamille(id: number): Observable<Famille> {
    const url = `${this.familleUrl}/${id}`;

    return this.http.delete<Famille>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Famille id=${id}`)),
      catchError(this.handleError<Famille>('deleteFamille'))
    );
  }
  //If you neglect to subscribe(), the service can't send the delete request to the server. As a rule, an Observable does nothing until something subscribes.

  searchFamilles(term: string): Observable<Famille[]> { //TODO : TOP 10 only, order by date desc
    if (!term.trim()) {
      // if not search term, return empty array.
      return of([]);
    }
    const url = `${this.familleUrl}`;
    return this.http.get<Famille[]>(`${url}/search/${term}`).pipe(
      tap(x => x.length ?
        this.log(`found famille matching "${term}"`) :
        this.log(`no famille matching "${term}"`)),
      tap(x => this.log(` "${x[0]._id}"`)),
      catchError(this.handleError<Famille[]>('searchFamilles', []))
    );
  }


  getMembre(id: string): Observable<Membre> { //TODO : TOP 10 only, order by date desc
    if (id === "") {
      // if not search term, return empty array.
      return of();
    }
    const url = `${this.familleUrl}/${id}`;
    return this.http.get<Membre>(url).pipe(
      tap(_ => this.log(`fetched famille id=${id}`)),
      catchError(this.handleError<Membre>(`getFamille id=${id}`))
    );
  }

  addOrUpdateAllMembres(id: Membre[]): Observable<string[]> { //TODO : TOP 10 only, order by date desc

    const url = `${this.familleUrl}/${id}`;
    return this.http.get<string[]>(url).pipe(
      tap(_ => this.log(`fetched famille id=${id}`)),
      catchError(this.handleError<string[]>(`getFamille id=${id}`))
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
