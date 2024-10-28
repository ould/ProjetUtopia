import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FamilleService } from './famille.service';
import { LoggerService } from 'src/app/autres-services/logger/logger.service';
import { environment } from 'src/environments/environment';
import { Famille } from './models/famille';
import { Membre } from './models/membre';

describe('FamilleService', () => {
  let service: FamilleService;
  let httpTestingController: HttpTestingController;
  let loggerService: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['handleError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FamilleService,
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    service = TestBed.inject(FamilleService);
    httpTestingController = TestBed.inject(HttpTestingController);
    loggerService = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
  });

  afterEach(() => {
    // Vérifiez qu'il n'y a pas de requêtes HTTP en attente
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a famille by id', () => {
    const mockFamille: Famille = { _id: '1', nom: 'Famille Test', beneficiairesId: [] };

    service.getFamille('1').subscribe(famille => {
      expect(famille).toEqual(mockFamille);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}famille/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFamille);
  });

  it('should add a famille', () => {
    const mockFamille: Famille = { _id: '1', nom: 'Famille Test', beneficiairesId: [] };

    service.addFamille(mockFamille).subscribe(response => {
      expect(response).toBe('1');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}famille`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFamille);
    req.flush('1');  // Simuler la réponse du serveur
  });

  it('should update a famille', () => {
    const mockFamille: Famille = { _id: '1', nom: 'Famille Test', beneficiairesId: [] };

    service.updateFamille(mockFamille).subscribe(response => {
      expect(response).toBe('1');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}famille`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockFamille);
    req.flush('1');
  });

  it('should delete a famille', () => {
    service.deleteFamille(1).subscribe(response => {
      expect(response).toBe('1');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}famille/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('1');
  });

  it('should search familles', () => {
    const mockFamilles: Famille[] = [{ _id: '1', nom: 'Famille Test 1', beneficiairesId: [] }];

    service.searchFamilles('Test').subscribe(familles => {
      expect(familles).toEqual(mockFamilles);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}famille/search/Test`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFamilles);
  });

  it('should handle errors when getting a famille', () => {
    const errorMessage = '404 error';

    service.getFamille('1').subscribe(
      () => fail('expected an error, not a famille'),
      error => expect(error).toContain(errorMessage)
    );

    const req = httpTestingController.expectOne(`${environment.apiUrl}famille/1`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should get membres', () => {
    const mockMembre: Membre = { _id: '1', nom: 'Membre Test' };

    service.getMembre('1').subscribe(membre => {
      expect(membre).toEqual(mockMembre);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}famille/membre/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMembre);
  });

  it('should save or update membres', () => {
    const mockMembre: Membre = { _id: '1', nom: 'Membre Test' };

    service.saveOrUpdateMembres([mockMembre]).subscribe(responses => {
      expect(responses).toEqual(['1']);
    });

    const req1 = httpTestingController.expectOne(`${environment.apiUrl}famille/membre`);
    expect(req1.request.method).toBe('POST');
    req1.flush('1');

    const req2 = httpTestingController.expectOne(`${environment.apiUrl}famille/membre`);
    expect(req2.request.method).toBe('PUT');
    req2.flush('1');
  });
});
