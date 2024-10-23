import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Utilisateur } from '../autres-services/utilisateur/utilisateur';
import { LoggerService } from '../autres-services/logger/logger.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let loggerService: jasmine.SpyObj<LoggerService>;

  const mockUser: Utilisateur = {
    nom: 'Doe',
    prenom: 'John',
    email: 'john.doe@example.com',
    password: 'password',
    antennes: ['Antenne1']
  };
  
  const authResult = {
    accessToken: 'mock-token',
    utilisateur: { nom: 'Doe' },
    expiresAt: JSON.stringify(Date.now() + 3600 * 1000) // 1 hour expiration
  };

  beforeEach(() => {
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['handleError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    loggerService = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should register a new user', () => {
    service.register(mockUser).subscribe(result => {
      expect(result).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should login a user and store session', () => {
    service.login(mockUser).subscribe(token => {
      expect(token).toBe(authResult.accessToken);
      expect(localStorage.getItem('id_token')).toBe(authResult.accessToken);
      expect(localStorage.getItem('user_name')).toBe(authResult.utilisateur.nom);
      expect(localStorage.getItem('expires_at')).toBe(authResult.expiresAt);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(authResult);
  });

  it('should logout a user and clear session', () => {
    // Simulate a session being set
    localStorage.setItem('id_token', authResult.accessToken);
    localStorage.setItem('user_name', authResult.utilisateur.nom);
    localStorage.setItem('expires_at', authResult.expiresAt);

    service.logout();
    
    const req = httpMock.expectOne(`${environment.apiUrl}auth/logout`);
    expect(req.request.method).toBe('GET');
    
    req.flush({});

    expect(localStorage.getItem('id_token')).toBeNull();
    expect(localStorage.getItem('user_name')).toBeNull();
    expect(localStorage.getItem('expires_at')).toBeNull();
  });

  it('should correctly check if user is logged in', () => {
    localStorage.setItem('expires_at', JSON.stringify(Date.now() + 3600 * 1000));
    expect(service.isLoggedIn()).toBeTrue();

    localStorage.setItem('expires_at', JSON.stringify(Date.now() - 1000));
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should handle isLoggedOut correctly', () => {
    spyOn(service, 'isLoggedIn').and.returnValue(false);
    expect(service.isLoggedOut()).toBeTrue();

    spyOn(service, 'isLoggedIn').and.returnValue(true);
    expect(service.isLoggedOut()).toBeFalse();
  });
});
