import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfilService } from './profil.service';
import { LoggerService } from 'src/app/autres-services/logger/logger.service';
import { Profil } from './profil';
import { of, throwError } from 'rxjs';

class MockLoggerService {
  handleError<T>(operation: string) {
    return (error: any): Observable<T> => {
      // Simule la gestion d'erreur
      console.error(`${operation} failed: ${error.message}`);
      return of({} as T); // Retourne une valeur par défaut pour éviter des erreurs
    };
  }
}

describe('ProfilService', () => {
  let service: ProfilService;
  let httpMock: HttpTestingController;

  const dummyProfil: Profil = { id: '1', nom: 'Admin', tableauDroits: [], commentaire: '' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProfilService,
        { provide: LoggerService, useClass: MockLoggerService }
      ]
    });
    service = TestBed.inject(ProfilService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes non traitées
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all profils', () => {
    service.getAll().subscribe(profils => {
      expect(profils.length).toBe(1);
      expect(profils).toEqual([dummyProfil]);
    });

    const req = httpMock.expectOne(`${service['profilUrl']}/getAll`);
    expect(req.request.method).toBe('GET');
    req.flush([dummyProfil]); // Simule la réponse du serveur
  });

  it('should fetch a profil by id', () => {
    service.get('1').subscribe(profil => {
      expect(profil).toEqual(dummyProfil);
    });

    const req = httpMock.expectOne(`${service['profilUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProfil); // Simule la réponse du serveur
  });

  it('should add a new profil', () => {
    const newProfil = { nom: 'User' };

    service.ajouterProfil(newProfil).subscribe(profil => {
      expect(profil).toEqual(dummyProfil);
    });

    const req = httpMock.expectOne(service['profilUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProfil);
    req.flush(dummyProfil); // Simule la réponse du serveur
  });

  it('should update a profil', () => {
    dummyProfil.nom = 'Updated Admin';
    
    service.update(dummyProfil).subscribe(profil => {
      expect(profil).toEqual(dummyProfil);
    });

    const req = httpMock.expectOne(service['profilUrl']);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dummyProfil);
    req.flush(dummyProfil); // Simule la réponse du serveur
  });

  it('should delete a profil', () => {
    service.delete('1').subscribe(response => {
      expect(response).toBe('Profil deleted');
    });

    const req = httpMock.expectOne(`${service['profilUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Profil deleted'); // Simule la réponse du serveur
  });

  it('should handle errors on fetch all profils', () => {
    service.getAll().subscribe(profils => {
      expect(profils).toEqual([]); // Vérifie que la réponse est vide en cas d'erreur
    });

    const req = httpMock.expectOne(`${service['profilUrl']}/getAll`);
    req.error(new ErrorEvent('Network error')); // Simule une erreur réseau
  });

});
