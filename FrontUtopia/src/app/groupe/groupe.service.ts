import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Groupe } from '../interfaces/groupe';
@Injectable({
  providedIn: 'root'
})
export class GroupeService {

  
  private groupeUrl = environment.apiUrl + 'groupe';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };



  isAdmin(): Observable<Boolean>{
    return this.http.post<Boolean>(this.groupeUrl + "/isadmin","", this.httpOptions).pipe(
    )
  }

  getUserGroupe(): Observable<Groupe>{
    return this.http.post<Groupe>(this.groupeUrl + "/getuserrole","", this.httpOptions).pipe()
  }

  getAllGroupes(): Observable<any>{
    return this.http.post<Groupe[]>(this.groupeUrl + "/getallrole","", this.httpOptions)
  }

  addGroupe(nomGroupe: string): Observable<Groupe> {
    const nomGroupeVar = {nom : nomGroupe}
    return this.http.post<Groupe>(this.groupeUrl, nomGroupeVar, this.httpOptions).pipe(
      catchError(this.handleError<any>('addRole'))
    );
  }

  updateGroupe(groupe: Groupe): Observable<Groupe> {
    return this.http.put<Groupe>(this.groupeUrl, groupe, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateRole'))
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
    private http: HttpClient
  ) { }
}
