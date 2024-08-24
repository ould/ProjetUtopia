import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) { }
}
