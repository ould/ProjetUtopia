import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Utilisateur } from 'src/app/autres-services/utilisateur/utilisateur';
import { Antenne } from 'src/app/gestionApp/interfaces/antenne';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let antenneService: jasmine.SpyObj<AntenneService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const antenneSpy = jasmine.createSpyObj('AntenneService', ['getAllPublic']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: AntenneService, useValue: antenneSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    antenneService = TestBed.inject(AntenneService) as jasmine.SpyObj<AntenneService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    const form = component.newUtilisateurForm;
    expect(form.get('nom')?.value).toBe('');
    expect(form.get('prenom')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
    expect(form.get('passwordConfirm')?.value).toBe('');
    expect(form.get('antennes')?.value).toBe('');
  });

  it('should call antenneService.getAllPublic on initialization', () => {
    const mockAntennes: Antenne[] = [{ id: '1', nom: 'Antenne 1' }];
    antenneService.getAllPublic.and.returnValue(of(mockAntennes));
    component.ngOnInit();
    expect(antenneService.getAllPublic).toHaveBeenCalled();
    expect(component.antennes).toEqual(mockAntennes);
  });

  it('should validate password and confirmPassword match', () => {
    component.newUtilisateurForm.setValue({
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      password: 'password123',
      passwordConfirm: 'password1234',
      antennes: '1'
    });

    expect(component.passwordMatchValidator()).toBeFalse();
    
    component.newUtilisateurForm.patchValue({ passwordConfirm: 'password123' });
    expect(component.passwordMatchValidator()).toBeTrue();
  });

  it('should call authService.register when form is valid', () => {
    const mockUser: Utilisateur = {
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      password: 'password123',
      antennes: ['1']
    };
    authService.register.and.returnValue(of(true));

    component.newUtilisateurForm.setValue({
      nom: mockUser.nom,
      prenom: mockUser.prenom,
      email: mockUser.email,
      password: mockUser.password,
      passwordConfirm: mockUser.password,
      antennes: '1'
    });

    component.register();

    expect(authService.register).toHaveBeenCalledWith(mockUser);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/accueil');
  });

  it('should not call authService.register when form is invalid', () => {
    component.newUtilisateurForm.setValue({
      nom: '',
      prenom: '',
      email: 'invalid email',
      password: '123',
      passwordConfirm: '1234',
      antennes: ''
    });

    component.register();

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should handle registration error', () => {
    const mockUser: Utilisateur = {
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      password: 'password123',
      antennes: ['1']
    };
    const errorResponse = { message: 'Registration failed' };
    authService.register.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');

    component.newUtilisateurForm.setValue({
      nom: mockUser.nom,
      prenom: mockUser.prenom,
      email: mockUser.email,
      password: mockUser.password,
      passwordConfirm: mockUser.password,
      antennes: '1'
    });

    component.register();

    expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'inscription :', errorResponse);
  });
});
