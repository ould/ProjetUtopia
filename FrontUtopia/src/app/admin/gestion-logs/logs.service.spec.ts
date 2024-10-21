import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LogsService } from './logs.service';
import { environment } from 'src/environments/environment';

describe('LogsService', () => {
  let service: LogsService;
  let httpMock: HttpTestingController;
  const apiUrlAdmin = environment.apiUrl + 'admin/log';
  const apiUrlPublique = environment.apiUrl + 'public/log';
  const apiUrl = environment.apiUrl + 'log';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LogsService]
    });
    service = TestBed.inject(LogsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve logs by page', () => {
    const mockResponse = { total: 10, logs: [{ message: 'Test log', type: 'INFO', application: 'Front', utilisateurId: '1', operation: 'TEST' }] };
    const page = 1;
    const itemsPerPage = 5;

    service.getLogParPage(page, itemsPerPage).subscribe(response => {
      expect(response.total).toBe(10);
      expect(response.logs.length).toBe(1);
      expect(response.logs[0].message).toBe('Test log');
    });

    const req = httpMock.expectOne(`${apiUrlAdmin}/getParPage?page=${page}&limit=${itemsPerPage}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error on getLogParPage', () => {
    service.getLogParPage(1, 5).subscribe(response => {
      expect(response.total).toBe(0);
      expect(response.logs.length).toBe(0);
    });

    const req = httpMock.expectOne(`${apiUrlAdmin}/getParPage?page=1&limit=5`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should log a public message', () => {
    const message = 'Public log message';
    const type = 'INFO';
    const operation = 'CREATE';

    service.logPublic(message, type, operation).subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne(apiUrlPublique);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      message,
      type,
      application: 'Front',
      utilisateurId: 'Public',
      operation
    });
    req.flush(true);
  });

  it('should handle error on logPublic', () => {
    const message = 'Failed log message';
    const type = 'ERROR';
    const operation = 'DELETE';

    service.logPublic(message, type, operation).subscribe(response => {
      expect(response).toBeFalse();
    });

    const req = httpMock.expectOne(apiUrlPublique);
    req.error(new ErrorEvent('Network error'));
  });

  it('should log a message', () => {
    const message = 'Regular log message';
    const type = 'INFO';
    const operation = 'UPDATE';

    service.log(message, type, operation).subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      message,
      type,
      application: 'Front',
      operation
    });
    req.flush(true);
  });

  it('should handle error on log', () => {
    const message = 'Error log message';
    const type = 'ERROR';
    const operation = 'READ';

    service.log(message, type, operation).subscribe(response => {
      expect(response).toBeFalse();
    });

    const req = httpMock.expectOne(apiUrl);
    req.error(new ErrorEvent('Network error'));
  });
});
