import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReferentielsService } from './referentiels.service';
import { LoggerService } from 'src/app/autres-services/logger/logger.service';
import { Referentiel } from 'src/app/gestionApp/interfaces/referentiel';
import { environment } from 'src/environments/environment';

describe('ReferentielsService', () => {
  let service: ReferentielsService;
  let httpMock: HttpTestingController;
  let loggerService: jasmine.SpyObj<LoggerService>;
  const apiUrl = environment.apiUrl + 'admin/referentiel';

  beforeEach(() => {
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['handleError']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReferentielsService,
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    service = TestBed.inject(ReferentielsService);
    httpMock = TestBed.inject(HttpTestingController);
    loggerService = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all referentiels', () => {
    const mockReferentiels: Referentiel[] = [{ id: '1', nom: 'Referentiel 1', antenneId: '1', nomAntenne: '', entitee: '' }];

    service.getAll().subscribe((referentiels) => {
      expect(referentiels).toEqual(mockReferentiels);
    });

    const req = httpMock.expectOne(`${apiUrl}/getAll`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReferentiels);
  });

  it('should retrieve a referentiel by id', () => {
    const mockReferentiel: Referentiel = { id: '1', nom: 'Referentiel 1', antenneId: '1', nomAntenne: '', entitee: '' };

    service.getById('1').subscribe((referentiel) => {
      expect(referentiel).toEqual(mockReferentiel);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReferentiel);
  });

  it('should create a new referentiel', () => {
    const mockReferentiel: Referentiel = { id: '2', nom: 'New Referentiel', antenneId: '1', nomAntenne: '', entitee: '' };

    service.createReferentiel('New Referentiel').subscribe((referentiel) => {
      expect(referentiel).toEqual(mockReferentiel);
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nom: 'New Referentiel' });
    req.flush(mockReferentiel);
  });

  it('should update a referentiel', () => {
    const updatedReferentiel: Referentiel = { id: '2', nom: 'Updated Referentiel', antenneId: '1', nomAntenne: '', entitee: '' };

    service.updateReferentiel(updatedReferentiel).subscribe((referentiel) => {
      expect(referentiel).toEqual(updatedReferentiel);
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedReferentiel);
    req.flush(updatedReferentiel);
  });

  it('should delete a referentiel', () => {
    service.deleteReferentiel('1').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle errors when retrieving all referentiels', () => {
    service.getAll().subscribe(
      () => fail('should have failed with an error'),
      () => {
        expect(loggerService.handleError).toHaveBeenCalledWith('getAll', []);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/getAll`);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle errors when retrieving a referentiel by id', () => {
    service.getById('1').subscribe(
      () => fail('should have failed with an error'),
      () => {
        expect(loggerService.handleError).toHaveBeenCalledWith('getById', undefined);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush('Error', { status: 404, statusText: 'Not Found' });
  });

  it('should handle errors when creating a referentiel', () => {
    service.createReferentiel('New Referentiel').subscribe(
      () => fail('should have failed with an error'),
      () => {
        expect(loggerService.handleError).toHaveBeenCalledWith('createReferentiel', undefined);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}`);
    req.flush('Error', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle errors when updating a referentiel', () => {
    const referentiel: Referentiel = { id: '2', nom: 'Updated Referentiel', antenneId: '1', nomAntenne: '', entitee: '' };

    service.updateReferentiel(referentiel).subscribe(
      () => fail('should have failed with an error'),
      () => {
        expect(loggerService.handleError).toHaveBeenCalledWith('updateReferentiel', undefined);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}`);
    req.flush('Error', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle errors when deleting a referentiel', () => {
    service.deleteReferentiel('1').subscribe(
      () => fail('should have failed with an error'),
      () => {
        expect(loggerService.handleError).toHaveBeenCalledWith('deleteReferentiel', undefined);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush('Error', { status: 400, statusText: 'Bad Request' });
  });
});
