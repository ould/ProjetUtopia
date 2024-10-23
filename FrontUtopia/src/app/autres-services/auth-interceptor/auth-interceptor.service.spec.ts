import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('AuthInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const mockUrl = '/api/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    // On peut également simuler un token ici pour les tests
    localStorage.setItem('id_token', 'mock-token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('id_token');
  });

  it('should add an Authorization header when a token is present', () => {
    httpClient.get(mockUrl).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(mockUrl);

    // Vérifie que la requête possède bien le header Authorization
    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');

    httpRequest.flush({});
  });

  it('should not add an Authorization header when no token is present', () => {
    localStorage.removeItem('id_token'); // Suppression du token

    httpClient.get(mockUrl).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(mockUrl);

    // Vérifie que la requête ne possède pas le header Authorization
    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();

    httpRequest.flush({});
  });
});
