import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../gestionApp/interfaces/login';
import { environment } from 'src/environments/environment';
import { Utilisateur } from '../autres-services/utilisateur/utilisateur';
import { LoggerService } from '../autres-services/logger/logger.service';
import { SessionService } from './session/session.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private authUrl = environment.apiUrl + 'auth';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };


  register(utilisateur: Utilisateur): Observable<boolean> {
    return this.http.post<boolean>(this.authUrl + "/register", utilisateur, this.httpOptions).pipe(
      catchError(this.logger.handleError<boolean>('register'))
    )
  };

  demandeReinitialiseMotDePasseByEmail(email: string): Observable<Boolean> {
    return this.http.post<Boolean>(this.authUrl + "/demandeReinitialiseMotDePasseByEmail", { email }, this.httpOptions).pipe(
      catchError(this.logger.handleError<any>('demandeReinitialiseMotDePasseByEmail'))
    )
  };


  accepteReinitialisationMotDePasse(hash: string, mdp: string): Observable<Boolean> {
    return this.http.post<Boolean>(this.authUrl + "/accepteReinitialisationMotDePasse", { hash, mdp }, this.httpOptions).pipe(
      catchError(this.logger.handleError<any>('accepteReinitialisationMotDePasse'))
    )
  };

  confirmerEmail(hash: string): Observable<Boolean> {
    return this.http.post<Boolean>(this.authUrl + "/confirmerEmail", { hash }, this.httpOptions).pipe(
      catchError(this.logger.handleError<any>('confirmerEmail'))
    )
  };

  login(utilisateur: Utilisateur): Observable<string> {
    return this.http.post<string>(this.authUrl + "/login", utilisateur, this.httpOptions).pipe(
      tap(token => this.sessionService.setSession(token)),
      catchError(this.logger.handleError<string>('login'))
    )
  }

  logout() {
    this.sessionService.removeSession();
    this.http.get<Login>(this.authUrl + "/logout").pipe(
      tap(_ => this.sessionService.removeSession()),
      catchError(this.logger.handleError<string>('logout'))
    );
  }



  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    private sessionService: SessionService) { }
}