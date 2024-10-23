import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilDetailComponent } from './profil-detail.component';
import { ProfilService } from '../profil.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { Profil } from '../profil';
import { Section } from 'src/app/gestionApp/interfaces/section';

class MockProfilService {
  get(id: string) {
    return of({ tableauDroits: [{ section: 'ADMIN', droits: '1' }], commentaire: 'Test commentaire' });
  }

  update(profil: Profil) {
    return of(null);
  }
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: (key: string) => '1' // Simule l'ID du profil
    }
  };
}

describe('ProfilDetailComponent', () => {
  let component: ProfilDetailComponent;
  let fixture: ComponentFixture<ProfilDetailComponent>;
  let profilService: MockProfilService;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProfilDetailComponent],
      providers: [
        { provide: ProfilService, useClass: MockProfilService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Location, useValue: { back: jasmine.createSpy('back') } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilDetailComponent);
    component = fixture.componentInstance;
    profilService = TestBed.inject(ProfilService);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch profil on init', () => {
    component.ngOnInit();
    expect(component.profil).toBeDefined();
    expect(component.profil.commentaire).toBe('Test commentaire');
    expect(component.updateProfilForm.get('ADMIN')?.value).toEqual(['1']);
  });

  it('should initialize form with data', () => {
    component.initializeForm();
    component.InitialiseFormWithData([{ section: 'ADMIN', droits: '1' }]);
    expect(component.updateProfilForm.get('ADMIN')?.value).toEqual(['1']);
    expect(component.updateProfilForm.get('commentaire')?.value).toBe('Test commentaire');
  });

  it('should modify profil if form is valid', () => {
    component.ngOnInit();
    component.updateProfilForm.get('commentaire')?.setValue('Updated commentaire');
    component.updateProfilForm.get('ADMIN')?.setValue(['0']); // Modifier les droits

    component.modifierProfil();

    expect(component.profil.commentaire).toBe('Updated commentaire');
    expect(component.profil.tableauDroits[0].droits).toBe('0'); // Vérifie que les droits ont été mis à jour
  });

  it('should not modify profil if form is invalid', () => {
    component.ngOnInit();
    component.updateProfilForm.get('commentaire')?.setValue(''); // Formulaire invalide

    component.modifierProfil();

    expect(component.profil.commentaire).toBe('Test commentaire'); // Doit rester inchangé
  });

  it('should navigate back', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});
