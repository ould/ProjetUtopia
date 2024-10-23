import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionReferentielsComponent } from './gestion-referentiels.component';
import { ReferentielsService } from './referentiels.service';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Referentiel } from 'src/app/gestionApp/interfaces/referentiel';

describe('GestionReferentielsComponent', () => {
  let component: GestionReferentielsComponent;
  let fixture: ComponentFixture<GestionReferentielsComponent>;
  let referentielService: jasmine.SpyObj<ReferentielsService>;
  let antenneService: jasmine.SpyObj<AntenneService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const referentielServiceSpy = jasmine.createSpyObj('ReferentielsService', ['getAll', 'createReferentiel', 'deleteReferentiel']);
    const antenneServiceSpy = jasmine.createSpyObj('AntenneService', ['getById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [GestionReferentielsComponent],
      providers: [
        { provide: ReferentielsService, useValue: referentielServiceSpy },
        { provide: AntenneService, useValue: antenneServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionReferentielsComponent);
    component = fixture.componentInstance;
    referentielService = TestBed.inject(ReferentielsService) as jasmine.SpyObj<ReferentielsService>;
    antenneService = TestBed.inject(AntenneService) as jasmine.SpyObj<AntenneService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load referentiels on initialization', () => {
    const mockReferentiels: Referentiel[] = [{ id: '1', nom: 'Test', antenneId: '1', nomAntenne: '', entitee: '' }];
    referentielService.getAll.and.returnValue(of(mockReferentiels));
    antenneService.getById.and.returnValue(of({ id: '1', nom: 'Antenne 1' }));

    component.ngOnInit();
    fixture.detectChanges();

    expect(referentielService.getAll).toHaveBeenCalled();
    expect(antenneService.getById).toHaveBeenCalledWith('1');
    expect(component.referentiels[0].nomAntenne).toBe('Antenne 1');
    expect(component.referentiels[0].entitee).toBe('Global');
  });

  it('should create a new referentiel', () => {
    const input = document.createElement('input');
    input.value = 'New Referentiel';
    referentielService.createReferentiel.and.returnValue(of(null));

    component.creerReferentiel(input);

    expect(referentielService.createReferentiel).toHaveBeenCalledWith('New Referentiel');
    expect(input.value).toBe('');
  });

  it('should not create a referentiel with empty input', () => {
    const input = document.createElement('input');
    input.value = '   ';

    component.creerReferentiel(input);

    expect(referentielService.createReferentiel).not.toHaveBeenCalled();
  });

  it('should open popup for deletion and confirm', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    referentielService.deleteReferentiel.and.returnValue(of(null));
    const mockReferentiel = { id: '1', nom: 'Test' };

    component.openPopupSuppression(mockReferentiel.nom, mockReferentiel.id);

    expect(window.confirm).toHaveBeenCalledWith(`Voulez-vous vraiment supprimer le référentiel "Test" ?`);
    expect(referentielService.deleteReferentiel).toHaveBeenCalledWith('1');
  });

  it('should navigate to referentiel edit page', () => {
    const referentielId = '1';
    component.editReferentiel(referentielId);

    expect(router.navigate).toHaveBeenCalledWith(['admin/referentiel', referentielId]);
  });

  it('should return "Global" if antenneId is undefined or empty', async () => {
    const result = await component.getNomAntenneByID('');
    expect(result).toBe('Global');
  });

  it('should get antenna name by ID', async () => {
    antenneService.getById.and.returnValue(of({ id: '1', nom: 'Antenne 1' }));

    const result = await component.getNomAntenneByID('1');
    expect(antenneService.getById).toHaveBeenCalledWith('1');
    expect(result).toBe('Antenne 1');
  });
});
