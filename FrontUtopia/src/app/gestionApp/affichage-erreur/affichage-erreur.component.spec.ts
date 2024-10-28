import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AffichageErreurComponent } from './affichage-erreur.component';
import { ErreurService } from 'src/app/autres-services/erreur/erreur.service';

describe('AffichageErreurComponent', () => {
  let component: AffichageErreurComponent;
  let fixture: ComponentFixture<AffichageErreurComponent>;
  let erreurService: jasmine.SpyObj<ErreurService>;

  beforeEach(() => {
    const erreurServiceSpy = jasmine.createSpyObj('ErreurService', ['getErreur', 'clearErreur']);

    TestBed.configureTestingModule({
      declarations: [AffichageErreurComponent],
      providers: [
        { provide: ErreurService, useValue: erreurServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AffichageErreurComponent);
    component = fixture.componentInstance;
    erreurService = TestBed.inject(ErreurService) as jasmine.SpyObj<ErreurService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to error messages on init', () => {
    const mockErrorMessage = 'Une erreur est survenue';
    erreurService.getErreur.and.returnValue(of(mockErrorMessage));

    component.ngOnInit();

    expect(erreurService.getErreur).toHaveBeenCalled();
    expect(component.messageErreur).toBe(mockErrorMessage);
  });

  it('should call clearErreur when closeAlert is called', () => {
    component.closeAlert();
    expect(erreurService.clearErreur).toHaveBeenCalled();
    expect(component.messageErreur).toBeNull(); // Vérifie que le message d'erreur est effacé
  });

  it('should not display the error message when it is null', () => {
    component.messageErreur = null; // Pas d'erreur
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeNull(); // Assurez-vous que l'élément n'existe pas
  });

  it('should display the error message when it is set', () => {
    component.messageErreur = 'Une erreur est survenue';
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement.nativeElement.textContent).toContain('Une erreur est survenue');
  });
});
