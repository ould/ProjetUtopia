import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FamillesComponent } from './familles.component';
import { FamilleService } from './famille.service';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { Autorisations } from 'src/app/gestionApp/interfaces/autorisations';

describe('FamillesComponent', () => {
  let component: FamillesComponent;
  let fixture: ComponentFixture<FamillesComponent>;
  let familleService: jasmine.SpyObj<FamilleService>;
  let utilisateurService: jasmine.SpyObj<UtilisateurService>;

  beforeEach(() => {
    const familleServiceSpy = jasmine.createSpyObj('FamilleService', ['getFamillesRecentes', 'searchFamilles', 'getStats']);
    const utilisateurServiceSpy = jasmine.createSpyObj('UtilisateurService', ['getDroits']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FamillesComponent],
      providers: [
        { provide: FamilleService, useValue: familleServiceSpy },
        { provide: UtilisateurService, useValue: utilisateurServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FamillesComponent);
    component = fixture.componentInstance;
    familleService = TestBed.inject(FamilleService) as jasmine.SpyObj<FamilleService>;
    utilisateurService = TestBed.inject(UtilisateurService) as jasmine.SpyObj<UtilisateurService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load recent families on init', () => {
    const mockRecentFamilies = [{ _id: '1', nom: 'Famille 1', beneficiairesId: [] }];
    familleService.getFamillesRecentes.and.returnValue(of(mockRecentFamilies));

    component.ngOnInit();

    expect(familleService.getFamillesRecentes).toHaveBeenCalled();
    component.famillesRecentes$.subscribe(familles => {
      expect(familles).toEqual(mockRecentFamilies);
    });
  });

  it('should load statistics on init', () => {
    const mockStats = { famillesVuesAujourdhui: 10, totalFamilles: 100 };
    familleService.getStats.and.returnValue(of(mockStats));

    component.loadStats();

    expect(familleService.getStats).toHaveBeenCalled();
    component.stats.famillesVuesAujourdhui = mockStats.famillesVuesAujourdhui;
    component.stats.totalFamilles = mockStats.totalFamilles;
    expect(component.stats).toEqual(mockStats);
  });

  it('should search for families', () => {
    const searchTerm = 'Test';
    const mockFamilies = [{ _id: '1', nom: 'Test Famille', beneficiairesId: [] }];
    familleService.searchFamilles.and.returnValue(of(mockFamilies));

    component.search(searchTerm);

    expect(familleService.searchFamilles).toHaveBeenCalledWith(searchTerm);
    component.familles$.subscribe(familles => {
      expect(familles).toEqual(mockFamilies);
    });
  });

  it('should get user permissions on init', () => {
    const mockAutorisations: Autorisations = { /* remplissez avec les données pertinentes */ };
    utilisateurService.getDroits.and.returnValue(of(mockAutorisations));

    component.ngOnInit();

    expect(utilisateurService.getDroits).toHaveBeenCalled();
    component.autorisations = mockAutorisations; // Si vous voulez vérifier les autorisations
  });
});
