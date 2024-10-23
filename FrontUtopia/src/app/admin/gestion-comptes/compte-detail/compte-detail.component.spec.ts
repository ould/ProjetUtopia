import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CompteDetailComponent } from './compte-detail.component';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { ProfilService } from '../../gestion-profil/profil.service';
import { Location } from '@angular/common';
import { Utilisateur } from 'src/app/autres-services/utilisateur/utilisateur';
import { Antenne } from 'src/app/gestionApp/interfaces/antenne';
import { Profil } from '../../gestion-profil/profil';

class MockUtilisateurService {
  getUtilisateur(id: string) {
    return of({ _id: id, nom: 'Test', prenom: 'User', email: 'test@example.com', antennes: ['1'], profilId: '1' });
  }

  updateUtilisateur(utilisateur: Utilisateur) {
    return of(null);
  }
}

class MockAntenneService {
  getAll() {
    return of([{ id: '1', name: 'Antenne 1' }]);
  }
}

class MockProfilService {
  getAll() {
    return of([{ id: '1', name: 'Profil 1' }]);
  }
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: (key: string) => '1' // Simule l'ID de l'utilisateur
    }
  };
}

describe('CompteDetailComponent', () => {
  let component: CompteDetailComponent;
  let fixture: ComponentFixture<CompteDetailComponent>;
  let utilisateurService: MockUtilisateurService;
  let antenneService: MockAntenneService;
  let profilService: MockProfilService;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CompteDetailComponent],
      providers: [
        { provide: UtilisateurService, useClass: MockUtilisateurService },
        { provide: AntenneService, useClass: MockAntenneService },
        { provide: ProfilService, useClass: MockProfilService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Location, useValue: { back: jasmine.createSpy('back') } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteDetailComponent);
    component = fixture.componentInstance;
    utilisateurService = TestBed.inject(UtilisateurService);
    antenneService = TestBed.inject(AntenneService);
    profilService = TestBed.inject(ProfilService);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch antennes and profils on init', () => {
    component.ngOnInit();
    expect(component.antennes.length).toBe(1);
    expect(component.profils.length).toBe(1);
  });

  it('should fetch utilisateur by ID on init', () => {
    component.ngOnInit();
    expect(component.utilisateur).toBeDefined();
    expect(component.utilisateur.nom).toBe('Test');
    expect(component.updateUtilisateurForm.value.nom).toBe('Test');
  });

  it('should update utilisateur if form is valid', () => {
    component.ngOnInit();
    component.updateUtilisateurForm.setValue({
      nom: 'Updated Name',
      prenom: 'Updated User',
      email: 'updated@example.com',
      antennes: ['1'],
      profil: '1'
    });

    component.modifierUtilisateur();

    expect(component.utilisateur.nom).toBe('Updated Name');
    expect(utilisateurService.updateUtilisateur).toHaveBeenCalledWith(component.utilisateur);
  });

  it('should not update utilisateur if form is invalid', () => {
    component.ngOnInit();
    component.updateUtilisateurForm.setValue({
      nom: '',
      prenom: '',
      email: '',
      antennes: '',
      profil: ''
    });

    component.modifierUtilisateur();

    expect(component.utilisateur.nom).toBe('Test'); // Vérifie que le nom n'a pas changé
  });

  it('should navigate back', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});
