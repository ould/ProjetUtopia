import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AntenneService } from './antenne.service';
import { environment } from 'src/environments/environment';
import { Antenne } from 'src/app/gestionApp/interfaces/antenne';
import { LoggerService } from '../logger/logger.service';

describe('AntenneService', () => {
  let service: AntenneService;
  let httpMock: HttpTestingController;
  let loggerService: jasmine.SpyObj<LoggerService>;

  const mockAntenne: Antenne = {
    id: '1',
    nom: 'Antenne1',
    description: 'Description de l\'antenne',
    localisation: 'Paris',
    // Ajoutez ici d'autres propriétés spécifiques si nécessaire
  };

  beforeEach(() => {
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['handleError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AntenneService,
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    service = TestBed.inject(AntenneService);
    httpMock = TestBed.inject(HttpTestingController);
    loggerService = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve an antenne by ID', () => {
    service.getById('1').subscribe((antenne) => {
      expect(antenne).toEqual(mockAntenne);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}antenne/getById/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAntenne);
  });

  it('should retrieve an antenne by name', () => {
    service.getByNom('Antenne1').subscribe((antenne) => {
      expect(antenne).toEqual(mockAntenne);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}antenne/getByNom/Antenne1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAntenne);
  });

  it('should retrieve all antennes', () => {
    service.getAll().subscribe((antennes) => {
      expect(antennes.length).toBe(1);
      expect(antennes).toEqual([mockAntenne]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}antenne/getAll`);
    expect(req.request.method).toBe('GET');
    req.flush([mockAntenne]);
  });

  it('should retrieve all public antennes', () => {
    service.getAllPublic().subscribe((antennes) => {
      expect(antennes.length).toBe(1);
      expect(antennes).toEqual([mockAntenne]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}public/antenne/getAll`);
    expect(req.request.method).toBe('GET');
    req.flush([mockAntenne]);
  });

  it('should add a new antenne', () => {
    service.add(mockAntenne).subscribe((result) => {
      expect(result).toEqual(mockAntenne);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}antenne`);
    expect(req.request.method).toBe('POST');
    req.flush(mockAntenne);
  });

  it('should update an existing antenne', () => {
    service.update(mockAntenne).subscribe((result) => {
      expect(result).toEqual(mockAntenne);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}antenne`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockAntenne);
  });

  it('should delete an antenne by ID', () => {
    service.delete('1').subscribe((result) => {
      expect(result).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}antenne/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
