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

  updateGroupe(oldNomGroupe: string, newNomGroupe: string): Observable<Groupe> {
    const objetModification = {oldNomGroupe, newNomGroupe}
    return this.http.put<Groupe>(this.groupeUrl, objetModification, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateRole'))
    );
  }

  deleteGroupe(id: string): Observable<Groupe> {
    const url = `${this.groupeUrl}/${id}`;
    return this.http.delete<Groupe>(url, this.httpOptions).pipe(
      catchError(this.handleError<any>('deleteGroupe'))
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
