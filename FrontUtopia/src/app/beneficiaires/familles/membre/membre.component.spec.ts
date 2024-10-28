import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { MembreComponent } from './membre.component';
import { FamilleService } from '../famille.service';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { of } from 'rxjs';

describe('MembreComponent', () => {
  let component: MembreComponent;
  let fixture: ComponentFixture<MembreComponent>;
  let familleService: jasmine.SpyObj<FamilleService>;
  let utilisateurService: jasmine.SpyObj<UtilisateurService>;

  beforeEach(async () => {
    const familleServiceSpy = jasmine.createSpyObj('FamilleService', ['getReferentielByNom']);
    const utilisateurServiceSpy = jasmine.createSpyObj('UtilisateurService', ['getDroits']);

    await TestBed.configureTestingModule({
      declarations: [MembreComponent],
      providers: [
        { provide: FamilleService, useValue: familleServiceSpy },
        { provide: UtilisateurService, useValue: utilisateurServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MembreComponent);
    component = fixture.componentInstance;
    familleService = TestBed.inject(FamilleService) as jasmine.SpyObj<FamilleService>;
    utilisateurService = TestBed.inject(UtilisateurService) as jasmine.SpyObj<UtilisateurService>;
  });

  beforeEach(() => {
    utilisateurService.getDroits.and.returnValue(of({ /* mock autorisations */ }));
    familleService.getReferentielByNom.and.returnValues(
      of(['Procédure 1', 'Procédure 2']), // Pour "Procedure"
      of(['France', 'Belgique']) // Pour "Pays"
    );

    component.membresInput = [{ nom: 'Membre Test' }];
    component.modificationEnCoursChange = new EventEmitter<boolean>();
    fixture.detectChanges(); // Appel de ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with data from services', () => {
    expect(component.procedures).toEqual(['Procédure 1', 'Procédure 2']);
    expect(component.nationalites).toEqual(['France', 'Belgique']);
    expect(familleService.getReferentielByNom.calls.count()).toBe(2);
  });

  it('should set modificationEnCours and emit event', () => {
    spyOn(component.modificationEnCoursChange, 'emit');
    component.changementChamp();
    expect(component.modificationEnCours).toBeTrue();
    expect(component.modificationEnCoursChange.emit).toHaveBeenCalledWith(true);
  });

  it('should add a new member', () => {
    const initialLength = component.membresInput.length;
    component.ajouterPersonne();
    expect(component.membresInput.length).toBe(initialLength + 1);
    expect(component.currentPersonneIndex).toBe(initialLength);
    expect(component.membresInput[initialLength].nom).toBe('');
  });

  it('should delete the current member', () => {
    component.currentPersonneIndex = 0; // Assurer que nous supprimons le premier membre
    component.supprimerPersonne();
    expect(component.membresInput.length).toBe(0);
    expect(component.currentPersonneIndex).toBe(0); // Réinitialisé à 0
  });

  it('should go to the next person', () => {
    component.membresInput = [{ nom: 'Membre 1' }, { nom: 'Membre 2' }];
    component.currentPersonneIndex = 0;
    component.nextPersonne();
    expect(component.currentPersonneIndex).toBe(1);
  });

  it('should go to the previous person', () => {
    component.membresInput = [{ nom: 'Membre 1' }, { nom: 'Membre 2' }];
    component.currentPersonneIndex = 1;
    component.prevPersonne();
    expect(component.currentPersonneIndex).toBe(0);
  });

  it('should not go beyond the bounds when navigating', () => {
    component.membresInput = [{ nom: 'Membre 1' }];
    component.currentPersonneIndex = 0;

    component.prevPersonne();
    expect(component.currentPersonneIndex).toBe(0); // Ne doit pas aller en arrière

    component.nextPersonne();
    expect(component.currentPersonneIndex).toBe(0); // Ne doit pas aller en avant
  });
});
