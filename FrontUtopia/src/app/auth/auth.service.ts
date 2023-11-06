import { Injectable } from '@angular/core';

import { Observable, of,  firstValueFrom} from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  // store the URL so we can redirect after logging in
  //redirectUrl: string | null = null;
  
  private loggedUrl = 'api/loggedIn/1';  // URL to web api (meme nom que database)
  
  ngOnInit(): void {
    this._isAuthenticated = this.getAuthenticated()
  }
  
  
  private _isAuthenticated: boolean = false
  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  getAuthenticated(): boolean {
    let aut = false;
    this.http.get<Login>(this.loggedUrl).subscribe((value: Login) => {
        aut = value.statut;
      console.log('RecupAuth ' +aut)
    });
  return aut;
  }


  login() {
    console.log('login :');
    this._isAuthenticated= true;
    this.updateLogged(true)
  }

  logout(){
    console.log('logout :')
    this._isAuthenticated= false;
    this.updateLogged(false)
  }

    updateLogged(logged: boolean) {
      console.log('update :' + logged)
      let loginObject : Login = {id: 1, statut: logged}
    this.http.post(this.loggedUrl, loginObject, this.httpOptions)
    .subscribe(() => this._isAuthenticated =logged )
  }

  

  constructor(
    private http: HttpClient) { }
}