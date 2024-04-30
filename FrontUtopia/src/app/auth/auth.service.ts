import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../interfaces/login';
import { User } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { GroupeService } from '../autres-services/groupe/groupe.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private authUrl = environment.apiUrl + 'auth';

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
    this.removeSession();
    this.http.get<Login>(this.authUrl + "/logout").pipe(
      tap(_ => this.removeSession())
    );
  }

  private setSession(authResult: any) {
    localStorage.setItem('user_name', authResult.user.nom);
    localStorage.setItem('id_token', authResult.accessToken);
    localStorage.setItem("expires_at", authResult.expiresAt);
    this.groupeService.isAdmin().subscribe(
      _data => {localStorage.setItem("isAdmin", _data+"");}
    )
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
    private groupeService: GroupeService) { }
}