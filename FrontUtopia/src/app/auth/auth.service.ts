import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, of, firstValueFrom } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../interfaces/login';
import { User } from '../interfaces/user';



@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private authUrl = 'http://localhost:3000/auth';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };


  register(user: User): Observable<boolean> {
    return this.http.post<boolean>(this.authUrl + "/register", user, this.httpOptions)
  }


  login(user: User): Observable<string> {
    return this.http.post<string>(this.authUrl + "/login", user, this.httpOptions).pipe(
      tap(token => this.setSession(token))
    )
  }

  logout() {
    console.log('logout :')
    this.removeSession();
    this.http.get<Login>(this.authUrl + "/logout").pipe(
      tap(_ => this.removeSession())
    );
  }


  private setSession(authResult :string) {
    const expiresAt = moment().add('5h', 'second'); //tODO depuis serveur

    localStorage.setItem('id_token', authResult);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }


  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }


  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration ?? '0');
    return moment(expiresAt);
  }

  private removeSession() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  constructor(
    private http: HttpClient) { }
}