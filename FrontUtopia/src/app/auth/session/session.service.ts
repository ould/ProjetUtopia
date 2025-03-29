import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public isLoggedIn() {
    return Date.now() <  this.getExpiration() ;
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  private getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration ?? '0');
    return expiresAt;
  }


  public setSession(authResult: any) {
    localStorage.setItem('user_name', authResult.utilisateur.nom);
    localStorage.setItem('id_token', authResult.accessToken);
    localStorage.setItem("expires_at", authResult.expiresAt);
  }

  public removeSession() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("expires_at");
  }
  constructor() { }
}
