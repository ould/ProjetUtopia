import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { LoggerService } from 'src/app/autres-services/logger/logger.service';
import { Historique } from 'src/app/gestionApp/interfaces/historique';
import { Section } from 'src/app/gestionApp/interfaces/section';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {

  private apiUrl = environment.apiUrl + Section.admin + '/historique';

  constructor(private http: HttpClient,
    private logger : LoggerService
  ) {}

  getHistoriqueParPage(page: number, itemsPerPage: number): Observable<{ total: number, historiques: Historique[] }> {
    const params = { page: page.toString(), limit: itemsPerPage.toString() };
    return this.http.get<{ total: number, historiques: Historique[] }>(`${this.apiUrl + "/getParPage"}`, { params }).pipe(
      catchError(this.logger.handleError<{ total: number, historiques: Historique[] }>('getHistoriqueParPage'))
    )
  }
}
