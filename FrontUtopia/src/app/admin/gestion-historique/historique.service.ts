import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Historique } from 'src/app/interfaces/historique';
import { Section } from 'src/app/interfaces/section';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {

  private apiUrl = environment.apiUrl + Section.admin + '/historique';

  constructor(private http: HttpClient) {}

  getHistoriqueParPage(page: number, itemsPerPage: number): Observable<{ total: number, historiques: Historique[] }> {
    const params = { page: page.toString(), limit: itemsPerPage.toString() };
    return this.http.get<{ total: number, historiques: Historique[] }>(`${this.apiUrl + "/getParPage"}`, { params });
  }
}
