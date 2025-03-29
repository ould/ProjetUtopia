import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SessionService } from 'src/app/auth/session.service';
import { Log } from 'src/app/gestionApp/interfaces/log';
import { Section } from 'src/app/gestionApp/interfaces/section';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private apiUrlAdmin = environment.apiUrl + Section.admin + '/log';
  private apiUrlPublique = environment.apiUrl + 'public/log';
  private apiUrl = environment.apiUrl + 'log';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

  constructor(private http: HttpClient
    , private sessionService : SessionService ) { }

  log(message: string, operation:string) {
    if (this.sessionService.isLoggedIn()) this.logPrive(message, "Erreur", operation).subscribe()
    else this.logPublic(message, "Erreur", operation).subscribe()
  }

  getLogParPage(page: number, itemsPerPage: number): Observable<{ total: number, logs: Log[] }> {
    const params = { page: page.toString(), limit: itemsPerPage.toString() };
    return this.http.get<{ total: number, logs: Log[] }>(`${this.apiUrlAdmin + "/getParPage"}`, { params }).pipe(
      catchError(error => {
        console.log(error);
        return of({ total: 0, logs: [] }); 
      })
    )
  }

  logPublic(message: string, type: string, operation:string): Observable<boolean> {
    const log: Log = { message: message, type: type, application: "Front", utilisateurId: "000000000000000000002456", operation: operation };
    return this.http.post<boolean>(`${this.apiUrlPublique}`, log, this.httpOptions).pipe(
      catchError(error => {
        console.log("Erreur log : " + message);
        console.log(error);
        return of(false); 
      })
    );
  }

  logPrive(message: string, type: string, operation:string): Observable<boolean> {
    const log: Log = { message: message, type: type, application: "Front", operation: operation};
    return this.http.post<boolean>(`${this.apiUrl}`, log, this.httpOptions).pipe(
      catchError(error => {
        console.log("Erreur log : " + message );
        console.log(error);
        return of(false); 
      }))
  }
}
