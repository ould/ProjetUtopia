import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ManageComptesComponent } from './gestion-comptes.component';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { PopupComponent } from 'src/app/gestionApp/popup/popup.component';

class MockUtilisateurService {
  getAll() {
    return of([{ _id: '1', email: 'test@example.com', nom: 'Test', prenom: 'User' }]);
  }
  
  addUtilisateur(utilisateur: any) {
    return of(null);
  }

  deleteUtilisateur(id: string) {
    return of(null);
  }
}

class MockAntenneService {
  getAll() {
    return of([]);
  }
}

describe('ManageComptesComponent', () => {
  let component: ManageComptesComponent;
  let fixture: ComponentFixture<ManageComptesComponent>;
  let utilisateurService: MockUtilisateurService;
  let antenneService: MockAntenneService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ManageComptesComponent, PopupComponent],
      providers: [
        { provide: UtilisateurService, useClass: MockUtilisateurService },
        { provide: AntenneService, useClass: MockAntenneService },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(true) }) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageComptesComponent);
    component = fixture.componentInstance;
    utilisateurService = TestBed.inject(UtilisateurService);
    antenneService = TestBed.inject(AntenneService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch utilisateurs on init', () => {
    component.ngOnInit();
    expect(component.utilisateurs.length).toBe(1);
    expect(component.utilisateurs[0].email).toBe('test@example.com');
  });

  it('should fetch antennes on init', () => {
    component.ngOnInit();
    expect(component.Antennes.length).toBe(0);
  });

  it('should add utilisateur if form is valid', () => {
    component.newUtilisateurForm.setValue({
      email: 'new@example.com',
      nom: 'New',
      prenom: 'User',
      antennes: '1',
      password: 'password'
    });

    component.ajouterUtilisateur();
    
    expect(component.utilisateurs.length).toBe(2);
    expect(component.utilisateurs[1].email).toBe('new@example.com');
  });

  it('should not add utilisateur if form is invalid', () => {
    component.newUtilisateurForm.setValue({
      email: '',
      nom: '',
      prenom: '',
      antennes: '',
      password: ''
    });

    component.ajouterUtilisateur();
    
    expect(component.utilisateurs.length).toBe(1);
  });

  it('should open delete popup and delete utilisateur', () => {
    spyOn(dialog, 'open').and.callThrough();
    spyOn(utilisateurService, 'deleteUtilisateur').and.callThrough();

    component.openPopupSupprimer(component.utilisateurs[0]);
    
    expect(dialog.open).toHaveBeenCalled();
    expect(utilisateurService.deleteUtilisateur).toHaveBeenCalledWith('1');
  });
});
