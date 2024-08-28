import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Referentiel } from 'src/app/interfaces/referentiel';
import { Section } from 'src/app/interfaces/section';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferentielsService { 
  
  private apiUrl =  environment.apiUrl + Section.admin +'/referentiel'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Referentiel[]> {
    return this.http.get<Referentiel[]>(this.apiUrl + "/getAll");
  }

  getById(id:string): Observable<Referentiel> {
    return this.http.get<Referentiel>(this.apiUrl + "/" + id);
  }

  createReferentiel(nom: string): Observable<Referentiel> {
    return this.http.post<Referentiel>(this.apiUrl, {nom});
  }

  deleteReferentiel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateReferentiel(referentiel: Referentiel): Observable<Referentiel> {
    return this.http.put<Referentiel>(`${this.apiUrl}`, referentiel);
  }
}
