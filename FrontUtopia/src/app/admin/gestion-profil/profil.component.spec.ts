import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilComponent } from './profil.component';
import { ProfilService } from './profil.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PopupComponent } from 'src/app/gestionApp/popup/popup.component';

class MockProfilService {
  getAll() {
    return of([]); // Retourne une liste vide pour simuler le chargement des profils
  }
  ajouterProfil(profil: any) {
    return of(profil); // Retourne le profil ajouté
  }
  delete(id: string) {
    return of(null); // Simule la suppression
  }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(false), // Simule la fermeture sans action
    };
  }
}

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;
  let profilService: ProfilService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilComponent],
      providers: [
        { provide: ProfilService, useClass: MockProfilService },
        { provide: MatDialog, useClass: MockMatDialog },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
    profilService = TestBed.inject(ProfilService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profils on init', () => {
    spyOn(profilService, 'getAll').and.callThrough(); // Spy on the service method
    component.ngOnInit();
    expect(profilService.getAll).toHaveBeenCalled();
    expect(component.profils).toEqual([]); // Vérifie que les profils sont chargés
  });

  it('should create a new profil', () => {
    const newProfilInput = { value: 'Test Profil' } as HTMLInputElement;
    component.creerProfil(newProfilInput);
    expect(component.profils.length).toBe(1); // Vérifie que le profil a été ajouté
    expect(component.profils[0].nom).toBe('Test Profil'); // Vérifie le nom du profil
  });

  it('should not create a profil with empty name', () => {
    const newProfilInput = { value: '' } as HTMLInputElement;
    spyOn(console, 'warn'); // Spy on console.warn
    component.creerProfil(newProfilInput);
    expect(console.warn).toHaveBeenCalledWith('Profile name cannot be empty'); // Vérifie que l'avertissement a été appelé
    expect(component.profils.length).toBe(0); // Vérifie qu'aucun profil n'a été ajouté
  });

  it('should open delete confirmation dialog', () => {
    const dialogSpy = spyOn(dialog, 'open').and.callThrough(); // Spy on open method
    component.openPopupSuppression('Test Profil', '1');
    expect(dialogSpy).toHaveBeenCalled(); // Vérifie que la boîte de dialogue a été ouverte
  });

  it('should delete a profil when confirmed', () => {
    const newProfilInput = { value: 'Profil à supprimer' } as HTMLInputElement;
    component.creerProfil(newProfilInput); // Ajoute un profil d'abord
    expect(component.profils.length).toBe(1); // Vérifie qu'un profil a été ajouté

    component.openPopupSuppression('Profil à supprimer', '1');
    expect(component.profils.length).toBe(1); // Vérifie qu'aucun profil n'a été supprimé immédiatement

    // Simule que l'utilisateur confirme la suppression
    spyOn(dialog.open().afterClosed(), 'subscribe').and.callFake((callback) => {
      callback(true); // Simule un clic sur "Oui"
    });

    component.openPopupSuppression('Profil à supprimer', '1');
    expect(component.profils.length).toBe(0); // Vérifie que le profil a été supprimé
  });
});
