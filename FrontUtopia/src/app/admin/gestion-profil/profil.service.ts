import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Section } from 'src/app/interfaces/section';
import { environment } from 'src/environments/environment';
import { Profil } from './profil';
import { LoggerService } from 'src/app/autres-services/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private profilUrl = environment.apiUrl + Section.admin + '/profil';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

  getAll(): Observable<Profil[]>{
    return this.http.get<Profil[]>(this.profilUrl + "/getAll").pipe(
      catchError(this.logger.handleError<Profil[]>('getAllProfil'))
    );
  }

  get(id:string): Observable<Profil>{
    return this.http.get<Profil>(this.profilUrl + "/" +id ).pipe(
      catchError(this.logger.handleError<Profil>('getProfil'))
    );
  }

  ajouterProfil(nomNouveauProfil: { nom: string; }) {
    return this.http.post<Profil>(this.profilUrl, nomNouveauProfil, this.httpOptions).pipe(
      catchError(this.logger.handleError<any>('ajoutProfil'))
    );
  }

  update(profil:Profil): Observable<Profil> {
    return this.http.put<Profil>(this.profilUrl, profil, this.httpOptions).pipe(
      catchError(this.logger.handleError<Profil>('updateProfil'))
    );
  }

  delete(id: string): Observable<string> {
    const url = `${this.profilUrl}/${id}`;
    return this.http.delete<string>(url, this.httpOptions).pipe(
      catchError(this.logger.handleError<string>('deleteProfil'))
    );
  }

  constructor(
    private http: HttpClient,
    private logger:LoggerService) { }
}
