import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { LoggerService } from 'src/app/autres-services/logger/logger.service';
import { Referentiel } from 'src/app/gestionApp/interfaces/referentiel';
import { Section } from 'src/app/gestionApp/interfaces/section';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferentielsService { 
  
  private apiUrl =  environment.apiUrl + Section.admin +'/referentiel'; 

  constructor(private http: HttpClient,
    private logger:LoggerService
  ) {}

  getAll(): Observable<Referentiel[]> {
    return this.http.get<Referentiel[]>(this.apiUrl + "/getAll").pipe(
      catchError(this.logger.handleError<Referentiel[]>('getAll'))
    );
  }

  getById(id:string): Observable<Referentiel> {
    return this.http.get<Referentiel>(this.apiUrl + "/" + id).pipe(
      catchError(this.logger.handleError<Referentiel>('getById'))
    );
  }

  createReferentiel(nom: string): Observable<Referentiel> {
    return this.http.post<Referentiel>(this.apiUrl, {nom}).pipe(
      catchError(this.logger.handleError<Referentiel>('createReferentiel'))
    );
  }

  deleteReferentiel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.logger.handleError<void>('deleteReferentiel'))
    );
  }

  updateReferentiel(referentiel: Referentiel): Observable<Referentiel> {
    return this.http.put<Referentiel>(`${this.apiUrl}`, referentiel).pipe(
      catchError(this.logger.handleError<Referentiel>('updateReferentiel'))
    );
  }
}
