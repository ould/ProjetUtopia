import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoggerService } from '../autres-services/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  private authUrl = environment.apiUrl + 'reporting';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };


  lance(): Observable<boolean> {
    return this.http.post<boolean>(this.authUrl + "/remplirGoogleSheet", "", this.httpOptions).pipe(
      catchError(this.logger.handleError<boolean>('remplirGoogleSheet'))
    )
  };

  constructor(private http: HttpClient,
    private logger: LoggerService,) { }
}
