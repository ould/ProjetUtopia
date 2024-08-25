import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Section } from 'src/app/interfaces/section';
import { environment } from 'src/environments/environment';
import { Profil } from './profil';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private profilUrl = environment.apiUrl + Section.admin + '/profil';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

  getAll(): Observable<Profil[]>{
    return this.http.get<Profil[]>(this.profilUrl + "/getAll")
  }

  get(id:string): Observable<Profil>{
    return this.http.get<Profil>(this.profilUrl + "/" +id )
  }

  ajouterProfil(nomNouveauProfil: { nom: string; }) {
    return this.http.post<Profil>(this.profilUrl, nomNouveauProfil, this.httpOptions).pipe(
      catchError(this.handleError<any>('ajoutProfil'))
    );
  }
  
  update(profil:Profil): Observable<Profil> {
    return this.http.put<Profil>(this.profilUrl, profil, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateUtilisateur'))
    );
  }

  delete(id: string): Observable<string> {
    const url = `${this.profilUrl}/${id}`;
    return this.http.delete<string>(url, this.httpOptions).pipe(
      catchError(this.handleError<any>('deleteProfil'))
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

  constructor(private http: HttpClient) { }
}
