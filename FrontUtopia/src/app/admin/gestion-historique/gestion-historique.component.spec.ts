import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GestionHistoriqueComponent } from './gestion-historique.component';
import { HistoriqueService } from './historique.service';
import { Historique } from 'src/app/gestionApp/interfaces/historique';

class MockHistoriqueService {
  getHistoriqueParPage(page: number, itemsPerPage: number) {
    return of({
      total: 50,
      historiques: [{ id: '1', action: 'Test action' }] // Exemple d'historique
    });
  }
}

describe('GestionHistoriqueComponent', () => {
  let component: GestionHistoriqueComponent;
  let fixture: ComponentFixture<GestionHistoriqueComponent>;
  let historiqueService: MockHistoriqueService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionHistoriqueComponent],
      providers: [
        { provide: HistoriqueService, useClass: MockHistoriqueService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionHistoriqueComponent);
    component = fixture.componentInstance;
    historiqueService = TestBed.inject(HistoriqueService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch historique on init', () => {
    component.ngOnInit();
    expect(component.historiques.length).toBe(1);
    expect(component.totalHistoriques).toBe(50);
    expect(component.loading).toBe(false);
  });

  it('should handle error when fetching historique', () => {
    spyOn(historiqueService, 'getHistoriqueParPage').and.returnValue(throwError('Erreur de test'));
    
    component.fetchHistorique(1);
    
    expect(component.historiques.length).toBe(0); // Doit être vide en cas d'erreur
    expect(component.loading).toBe(false); // Doit arrêter le chargement
  });

  it('should handle page change and fetch new historique', () => {
    component.onPageChange(2);
    expect(component.page).toBe(2);
    expect(component.historiques.length).toBe(1); // Assume que la méthode renvoie toujours un historique pour le test
  });

  it('should calculate total pages correctly', () => {
    component.totalHistoriques = 50;
    expect(component.totalPages).toBe(5);
  });
});
