import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HistoriqueService } from './historique.service';
import { LoggerService } from 'src/app/autres-services/logger/logger.service';
import { environment } from 'src/environments/environment';
import { Historique } from 'src/app/gestionApp/interfaces/historique';

class MockLoggerService {
  handleError<T>(operation: string) {
    return (error: any): Observable<T> => {
      // Simule la gestion d'erreur, log ou autre action
      console.error(`${operation} failed: ${error.message}`);
      return of({} as T); // Retourne une valeur par défaut pour éviter des erreurs
    };
  }
}

describe('HistoriqueService', () => {
  let service: HistoriqueService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HistoriqueService,
        { provide: LoggerService, useClass: MockLoggerService }
      ]
    });
    service = TestBed.inject(HistoriqueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes non traitées
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch historique by page', () => {
    const dummyHistorique: Historique[] = [{ id: '1', action: 'Test action' }];
    const expectedResponse = { total: 1, historiques: dummyHistorique };

    service.getHistoriqueParPage(1, 10).subscribe(response => {
      expect(response.total).toBe(1);
      expect(response.historiques.length).toBe(1);
      expect(response.historiques).toEqual(dummyHistorique);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}admin/historique/getParPage?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse); // Simule la réponse du serveur
  });

  it('should handle error when fetching historique', () => {
    service.getHistoriqueParPage(1, 10).subscribe(response => {
      expect(response).toEqual({ total: 0, historiques: [] }); // Valeur par défaut en cas d'erreur
    });

    const req = httpMock.expectOne(`${environment.apiUrl}admin/historique/getParPage?page=1&limit=10`);
    req.error(new ErrorEvent('Network error')); // Simule une erreur réseau
  });
});
