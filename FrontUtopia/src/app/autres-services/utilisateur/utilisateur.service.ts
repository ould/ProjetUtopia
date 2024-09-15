import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError} from 'rxjs';
import { Antenne } from 'src/app/interfaces/antenne';
import { Section } from 'src/app/interfaces/section';
import { environment } from 'src/environments/environment';
import { Utilisateur } from './utilisateur';
import { LoggerService } from '../logger/logger.service';

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
    return this.http.get<Utilisateur>(this.utilisateurUrl + "/" +id ).pipe().pipe(
      catchError(this.logger.handleError<Utilisateur>('getAllUtilisateur'))
    );
  }

  getAll(): Observable<Utilisateur[]>{
    return this.http.get<Utilisateur[]>(this.utilisateurUrl + "/getAll").pipe(
      catchError(this.logger.handleError<Utilisateur[]>('getAllUtilisateur'))
    );
  }

  addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.utilisateurUrl, utilisateur, this.httpOptions).pipe(
      catchError(this.logger.handleError<Utilisateur>('addUtilisateur'))
    );
  }

  updateUtilisateur(utilisateur:Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(this.utilisateurUrl, utilisateur, this.httpOptions).pipe(
      catchError(this.logger.handleError<Utilisateur>('updateUtilisateur'))
    );
  }

  deleteUtilisateur(id: string): Observable<Utilisateur> {
    const url = `${this.utilisateurUrl}/${id}`;
    return this.http.delete<Utilisateur>(url, this.httpOptions).pipe(
      catchError(this.logger.handleError<any>('deleteUtilisateur'))
    );
  }

  accesSection(nomSectionDemandee: string): Observable<Boolean> {
    const url = `${this.selfUtilisateurUrl}/accesSection/${nomSectionDemandee}`;
    return this.http.get<Boolean>(url).pipe(
      catchError(this.logger.handleError<Boolean>('accesSection'))
    );
  }

  getAntennes(): Observable<Antenne[]> {
    const url = `${this.selfUtilisateurUrl}/antennes/`;
    return this.http.get<Antenne[]>(url).pipe(
      catchError(this.logger.handleError<Antenne[]>('getAntennes'))
    );
  }

  getAntenneDefaut(): Observable<Antenne> {
    const url = `${this.selfUtilisateurUrl}/antenneDefaut/`;
    return this.http.get<Antenne>(url).pipe(
      catchError(this.logger.handleError<Antenne>('getAntenneDefaut'))
    );
  }

  changeAntenneDefaut(nouvelleAntenneId:string): Observable<Antenne> {
    //Mettre crochet sur la variable car attends un json
    return this.http.post<Antenne>(`${this.selfUtilisateurUrl}/antenneDefaut`, {nouvelleAntenneId} , this.httpOptions).pipe(
      catchError(this.logger.handleError<Antenne>('changeAntenneDefaut'))
    ); 
  }
  
  isAdmin(): Observable<Boolean>{
    return this.http.post<Boolean>(this.selfUtilisateurUrl + "/isAdmin","", this.httpOptions).pipe(
      catchError(this.logger.handleError<Boolean>('isAdmin'))
    )
  }
  
  constructor(
    private http: HttpClient,
  private logger:LoggerService) { }
}
