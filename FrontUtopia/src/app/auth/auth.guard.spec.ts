import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { SessionService } from './session/session.service';

describe('authGuard', () => {
  let sessionService: jasmine.SpyObj<SessionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    sessionService = TestBed.inject(SessionService) as jasmine.SpyObj<SessionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should return true if the user is logged in', () => {
    sessionService.isLoggedIn.and.returnValue(true);

    const result = authGuard();

    expect(result).toBeTrue();
    expect(sessionService.isLoggedIn).toHaveBeenCalled();
  });
})
