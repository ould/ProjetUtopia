import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { LoggerService } from 'src/app/autres-services/logger/logger.service';
import { Log } from 'src/app/gestionApp/interfaces/log';
import { Section } from 'src/app/gestionApp/interfaces/section';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private apiUrl = environment.apiUrl + Section.admin + '/log';

  constructor(private http: HttpClient,
    private logger: LoggerService
  ) {}

  getLogParPage(page: number, itemsPerPage: number): Observable<{ total: number, logs: Log[] }> {
    const params = { page: page.toString(), limit: itemsPerPage.toString() };
    return this.http.get<{ total: number, logs: Log[] }>(`${this.apiUrl + "/getParPage"}`, { params }).pipe(
      catchError(this.logger.handleError<{ total: number, logs: Log[] }>('getLogParPage'))
    )
  }
}
