import { Injectable } from '@angular/core';
import { Famille } from '../../interfaces/famille';
import { Observable, forkJoin, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, flatMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Personne } from 'src/app/interfaces/Personne';
import { PersonneService } from 'src/app/personne/personne.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {

  private familleUrl = 'http://localhost:3000/famille';  // URL to web api (meme nom que database)
  private personneUrl = 'api/personnes';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

    /** POST: add a new Famille to the server */
addFamille(Famille: Famille): Observable<Famille> {

  // var listPersonneId:string[]
  // Famille.personnes.forEach(personne => {
  //   this.addPersonne(personne).subscribe(id => listPersonneId.push(id))
  //   console.log(listPersonneId)
  // });



  return this.http.post<Famille>(this.familleUrl, Famille, this.httpOptions).pipe(
    tap((newFamille: Famille) => this.log(`added Famille w/ id=${newFamille.familleId}`)),
    catchError(this.handleError<Famille>('addFamille'))
  );
}

  /** PUT: update the Famille on the server */
  addPersonne(Personne: Personne): Observable<any> {
    return this.http.put(this.personneUrl, Personne, this.httpOptions).pipe(
      tap(_ => this.log(`add Personne id=${Personne.nom}`)),
      catchError(this.handleError<any>('addPersonne'))
    );
}

  /** PUT: update the Famille on the server */
  updateFamille(Famille: Famille): Observable<any> {
    return this.http.put(this.familleUrl, Famille, this.httpOptions).pipe(
      tap(_ => this.log(`updated Famille id=${Famille.familleId}`)),
      catchError(this.handleError<any>('updateFamille'))
  );
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
  return this.http.get<Famille[]>(`${url}/?nomFamille=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found famille matching "${term}"`) :
       this.log(`no famille matching "${term}"`)),
    catchError(this.handleError<Famille[]>('searchFamilles', []))
  );
}

getFamille(id: string): Observable<Famille> {
  if (id === "") {
    // if not search term, return empty array.
    return of();
  }
  console.log("test")
  const url = `${this.familleUrl}/${id}`;
  var familleResult = this.http.get<Famille>(url).pipe(
    tap(_ =>  this.log(`fetched famille id=${id}`)),

    // map((famille :Famille) => {
    //   famille.personnesId.forEach(personneid => {
    //     this.personneService.getPersonne(personneid)
    //       .pipe(
    //         map(personne => familleResult.subscribe(push(personne))));
    //     })
    //   }),

    catchError(this.handleError<Famille>(`getFamille id=${id}`))
    );
    console.log(familleResult)
return familleResult;

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
  private http: HttpClient,
  private personneService: PersonneService) { }
}
