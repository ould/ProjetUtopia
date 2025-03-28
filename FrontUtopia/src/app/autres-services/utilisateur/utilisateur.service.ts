import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { Antenne } from 'src/app/gestionApp/interfaces/antenne';
import { Section } from 'src/app/gestionApp/interfaces/section';
import { environment } from 'src/environments/environment';
import { Utilisateur } from './utilisateur';
import { LoggerService } from '../logger/logger.service';
import { Autorisations } from 'src/app/gestionApp/interfaces/autorisations';
import { Droit, DroitPossible } from 'src/app/admin/gestion-profil/profil';
import { SessionService } from 'src/app/auth/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {


  private utilisateurUrl = environment.apiUrl + Section.admin + '/utilisateur';
  private selfUtilisateurUrl = environment.apiUrl + 'selfUtilisateur'; // TODO Revoir quand c'est self et quand c'est admin

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };



  getUtilisateur(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(this.utilisateurUrl + "/" + id).pipe().pipe(
      catchError(this.logger.handleError<Utilisateur>('getAllUtilisateur'))
    );
  }

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.utilisateurUrl + "/getAll").pipe(
      catchError(this.logger.handleError<Utilisateur[]>('getAllUtilisateur'))
    );
  }

  addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.utilisateurUrl, utilisateur, this.httpOptions).pipe(
      catchError(this.logger.handleError<Utilisateur>('addUtilisateur'))
    );
  }

  updateUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(this.utilisateurUrl, utilisateur, this.httpOptions).pipe(
      catchError(this.logger.handleError<Utilisateur>('updateUtilisateur'))
    );
  }

  deleteUtilisateur(id: string): Observable<string> {
    const url = `${this.utilisateurUrl}/${id}`;
    return this.http.delete<string>(url, this.httpOptions).pipe(
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

  changeAntenneDefaut(nouvelleAntenneId: string): Observable<Antenne> {
    //Mettre crochet sur la variable car attends un json
    return this.http.post<Antenne>(`${this.selfUtilisateurUrl}/antenneDefaut`, { nouvelleAntenneId }, this.httpOptions).pipe(
      catchError(this.logger.handleError<Antenne>('changeAntenneDefaut'))
    );
  }

  isAdmin(): Observable<Boolean> {
    return this.http.post<Boolean>(this.selfUtilisateurUrl + "/isAdmin", "", this.httpOptions).pipe(
      catchError(this.logger.handleError<Boolean>('isAdmin'))
    )
  }

  getDroits(section: string): Observable<Autorisations> {
    if(this.sessionService.isLoggedIn()){  
      return this.http.get<Droit>(this.selfUtilisateurUrl + "/droits/" + section).pipe(
        map(droit => this.mapDroitsToAutorisations(section, droit)),
        catchError(this.logger.handleError<Autorisations>('getDroits'))
      )
    }else{
      return new Observable<Autorisations>();
    }
  }


  private mapDroitsToAutorisations(section: string, droit: Droit): Autorisations {

    const autorisations: Autorisations = {
      section: section,
      lecture: false,
      ajout: false,
      modification: false,
      suppression: false,
      admin: false,
    };
    
    if (droit?.droits) {
      for (const char of droit.droits) {
        switch (char) {
          case DroitPossible.lecture:
            autorisations.lecture = true;
            break;
          case DroitPossible.ajout:
            autorisations.ajout = true;
            break;
          case DroitPossible.modification:
            autorisations.modification = true;
            break;
          case DroitPossible.suppression:
            autorisations.suppression = true;
            break;
          case DroitPossible.admin:
            autorisations.admin = true;
            autorisations.suppression = true;
            autorisations.modification = true;
            autorisations.ajout = true;
            autorisations.lecture = true;
            break;
        }
      }
    }
    return autorisations;

  }

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
private sessionService:SessionService) { }
}
