import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Antenne } from 'src/app/interfaces/antenne';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AntenneService {

  private antenneUrl = environment.apiUrl + 'antenne';
  private adminAntenneUrl = environment.apiUrl + 'antenne';
  private publicAntenneUrl = environment.apiUrl + 'public/antenne';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };


  getById(id: string): Observable<Antenne> {
    return this.http.get<Antenne>(this.antenneUrl + "/getById/" + id).pipe(
      catchError(this.logger.handleError<Antenne>('AntennegetById'))
    );
  }

  getByNom(nom: string): Observable<Antenne> {
    return this.http.get<Antenne>(this.antenneUrl + "/getByNom/" + nom).pipe(
      catchError(this.logger.handleError<Antenne>('getAntenneByNom'))
    );
  }

  getAll(): Observable<Antenne[]> {
    return this.http.get<Antenne[]>(this.antenneUrl + "/getAll").pipe(
      catchError(this.logger.handleError<Antenne[]>('getAllAntenne'))
    );
  }

  getAllPublic(): Observable<Antenne[]> {
    return this.http.get<Antenne[]>(this.publicAntenneUrl + "/getAll").pipe(
      catchError(this.logger.handleError<Antenne[]>('getAllPublicAntenne'))
    );
  }

  add(utilisateur: Antenne): Observable<Antenne> {
    return this.http.post<Antenne>(this.adminAntenneUrl, utilisateur, this.httpOptions).pipe(
      catchError(this.logger.handleError<Antenne>('addAntenne'))
    );
  }

  update(utilisateur: Antenne): Observable<Antenne> {
    return this.http.put<Antenne>(this.adminAntenneUrl, utilisateur, this.httpOptions).pipe(
      catchError(this.logger.handleError<any>('updateAntenne'))
    );
  }

  delete(id: string): Observable<Antenne> {
    const url = `${this.adminAntenneUrl}/${id}`;
    return this.http.delete<Antenne>(url, this.httpOptions).pipe(
      catchError(this.logger.handleError<any>('deleteAntenne'))
    );
  }

  constructor(
    private http: HttpClient,
    private logger: LoggerService) { }
}
