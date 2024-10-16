import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../gestionApp/interfaces/login';
import { environment } from 'src/environments/environment';
import { Utilisateur } from '../autres-services/utilisateur/utilisateur';
import { LoggerService } from '../autres-services/logger/logger.service';


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
      catchError(this.logger.handleError<boolean>('register', true))
    )
  }

  login(utilisateur: Utilisateur): Observable<string> {
    return this.http.post<string>(this.authUrl + "/login", utilisateur, this.httpOptions).pipe(
      tap(token => this.setSession(token)),
      catchError(this.logger.handleError<string>('login', true))
    )
  }

  logout() {
    this.removeSession();
    this.http.get<Login>(this.authUrl + "/logout").pipe(
      tap(_ => this.removeSession()),
      catchError(this.logger.handleError<string>('logout'))
    );
  }

  private setSession(authResult: any) {
    localStorage.setItem('user_name', authResult.utilisateur.nom);
    localStorage.setItem('id_token', authResult.accessToken);
    localStorage.setItem("expires_at", authResult.expiresAt);
  }

  public isLoggedIn() {
    return Date.now() <  this.getExpiration() ;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration ?? '0');
    return expiresAt;
  }

  private removeSession() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("expires_at");
  }

  constructor(
    private http: HttpClient,
    private logger:LoggerService) { }
}