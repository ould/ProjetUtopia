import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FamilleDetailComponent } from './famille-detail.component';
import { FamilleService } from '../famille.service';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { Location } from '@angular/common';

describe('FamilleDetailComponent', () => {
  let component: FamilleDetailComponent;
  let fixture: ComponentFixture<FamilleDetailComponent>;
  let familleService: jasmine.SpyObj<FamilleService>;
  let utilisateurService: jasmine.SpyObj<UtilisateurService>;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    const familleServiceSpy = jasmine.createSpyObj('FamilleService', ['getFamille', 'saveOrUpdateMembres', 'addFamille', 'updateFamille', 'getMembres', 'updateMembre']);
    const utilisateurServiceSpy = jasmine.createSpyObj('UtilisateurService', ['getDroits']);

    await TestBed.configureTestingModule({
      declarations: [FamilleDetailComponent],
      providers: [
        { provide: FamilleService, useValue: familleServiceSpy },
        { provide: UtilisateurService, useValue: utilisateurServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: Location, useValue: { back: jasmine.createSpy('back') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FamilleDetailComponent);
    component = fixture.componentInstance;
    familleService = TestBed.inject(FamilleService) as jasmine.SpyObj<FamilleService>;
    utilisateurService = TestBed.inject(UtilisateurService) as jasmine.SpyObj<UtilisateurService>;
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    utilisateurService.getDroits.and.returnValue(of({/* mock autorisations */}));
    familleService.getFamille.and.returnValue(of({ nom: 'Famille Test', beneficiairesId: [] }));
    fixture.detectChanges(); // Appel de ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with famille data', () => {
    expect(component.familleInput.nom).toBe('Famille Test');
    expect(familleService.getFamille).toHaveBeenCalledWith('1');
  });

  it('should toggle member display', () => {
    expect(component.showMembres).toBeFalse();
    component.basculerAffichageMembres();
    expect(component.showMembres).toBeTrue();
  });

  it('should go back with confirmation on unsaved changes', () => {
    component.modificationEnCours = true;
    spyOn(window, 'confirm').and.returnValue(true);
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should not go back without confirmation on unsaved changes', () => {
    component.modificationEnCours = true;
    spyOn(window, 'confirm').and.returnValue(false);
    component.goBack();
    expect(location.back).not.toHaveBeenCalled();
  });

  it('should save or update family', () => {
    const familleForm = { invalid: false };
    familleService.saveOrUpdateMembres.and.returnValue(of(['1']));
    familleService.addFamille.and.returnValue(of('123'));
    
    component.membresFamille = [{ nom: 'Membre 1' }];
    component.saveOrUpdate(familleForm);

    expect(familleService.saveOrUpdateMembres).toHaveBeenCalledWith(component.membresFamille);
    expect(familleService.addFamille).toHaveBeenCalledWith(component.familleInput);
    expect(router.navigate).toHaveBeenCalledWith(['/detailFamille/123']);
  });

  it('should not save if form is invalid', () => {
    const familleForm = { invalid: true };
    component.saveOrUpdate(familleForm);
    expect(familleService.saveOrUpdateMembres).not.toHaveBeenCalled();
  });
});
