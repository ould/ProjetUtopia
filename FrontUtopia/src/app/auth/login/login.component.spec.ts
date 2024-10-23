import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Utilisateur } from 'src/app/autres-services/utilisateur/utilisateur';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let mockActivatedRoute;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    mockActivatedRoute = {
      snapshot: {
        queryParams: { originUrl: 'dashboard' }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should have required validators for email and password', () => {
    const emailControl = component.form.get('email');
    const passwordControl = component.form.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTrue();
    expect(passwordControl?.hasError('required')).toBeTrue();
  });

  it('should call login method on form submission', () => {
    const mockUser: Utilisateur = { email: 'test@example.com', password: 'password123' };
    authService.login.and.returnValue(of(true));

    component.form.setValue(mockUser);
    component.login();

    expect(authService.login).toHaveBeenCalledWith(mockUser);
  });

  it('should redirect to the originUrl on successful login', () => {
    const mockUser: Utilisateur = { email: 'test@example.com', password: 'password123' };
    authService.login.and.returnValue(of(true));
    spyOn(window.location, 'href', 'set');

    component.form.setValue(mockUser);
    component.login();

    expect(window.location.href).toBe('/dashboard');
  });

  it('should default to "accueil" when originUrl is empty or includes "logout"', () => {
    mockActivatedRoute.snapshot.queryParams['originUrl'] = 'logout';
    const mockUser: Utilisateur = { email: 'test@example.com', password: 'password123' };
    authService.login.and.returnValue(of(true));
    spyOn(window.location, 'href', 'set');

    component.form.setValue(mockUser);
    component.login();

    expect(window.location.href).toBe('/accueil');
  });

  it('should not call login if form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    component.login();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should handle login error and log it', () => {
    const mockUser: Utilisateur = { email: 'test@example.com', password: 'password123' };
    const errorResponse = { message: 'Invalid credentials' };
    authService.login.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');

    component.form.setValue(mockUser);
    component.login();

    expect(console.error).toHaveBeenCalledWith('Erreur lors de la connexion :', errorResponse);
  });
});
