import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Antenne } from 'src/app/interfaces/antenne';
import { Section } from 'src/app/interfaces/section';
import { environment } from 'src/environments/environment';
import { Utilisateur } from './utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {


  private utilisateurUrl = environment.apiUrl + Section.admin + '/utilisateur';
  private selfUtilisateurUrl = environment.apiUrl + 'selfUtilisateur'; // TODO Revoir quand c'est self et quand c'est admin

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };



  getUtilisateur(id: string): Observable<Utilisateur>{
    return this.http.get<Utilisateur>(this.utilisateurUrl + "/" +id ).pipe()
  }

  getAll(): Observable<Utilisateur[]>{
    return this.http.get<Utilisateur[]>(this.utilisateurUrl + "/getAll")
  }

  addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.utilisateurUrl, utilisateur, this.httpOptions).pipe(
      catchError(this.handleError<any>('addUtilisateur'))
    );
  }

  updateUtilisateur(utilisateur:Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(this.utilisateurUrl, utilisateur, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateUtilisateur'))
    );
  }

  deleteUtilisateur(id: string): Observable<Utilisateur> {
    const url = `${this.utilisateurUrl}/${id}`;
    return this.http.delete<Utilisateur>(url, this.httpOptions).pipe(
      catchError(this.handleError<any>('deleteUtilisateur'))
    );
  }

  accesSection(nomSectionDemandee: string): Observable<Boolean> {
    const url = `${this.selfUtilisateurUrl}/accesSection/${nomSectionDemandee}`;
    return this.http.get<Boolean>(url).pipe();
  }

  getAntennes(): Observable<Antenne[]> {
    const url = `${this.selfUtilisateurUrl}/antennes/`;
    return this.http.get<Antenne[]>(url).pipe();
  }

  getAntenneDefaut(): Observable<Antenne> {
    const url = `${this.selfUtilisateurUrl}/antenneDefaut/`;
    return this.http.get<Antenne>(url).pipe();
  }

  changeAntenneDefaut(nouvelleAntenneId:string): Observable<Antenne> {
    return this.http.post<Antenne>(`${this.selfUtilisateurUrl}/antenneDefaut`, {nouvelleAntenneId} , this.httpOptions).pipe(); //Mettre crochet sur la variable car attends un json
  }
  
  isAdmin(): Observable<Boolean>{
    return this.http.post<Boolean>(this.selfUtilisateurUrl + "/isAdmin","", this.httpOptions).pipe(
    )
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
