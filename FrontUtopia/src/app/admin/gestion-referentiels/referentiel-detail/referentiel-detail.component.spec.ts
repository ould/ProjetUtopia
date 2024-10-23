import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferentielDetailComponent } from './referentiel-detail.component';
import { ReferentielsService } from '../referentiels.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { Referentiel } from 'src/app/gestionApp/interfaces/referentiel';

class MockReferentielsService {
  getById(id: string) {
    return of({ nom: 'Test Referentiel', donnees: [] }); // Mocking the service response
  }
  updateReferentiel(referentiel: Referentiel) {
    return of(null); // Mock update response
  }
}

class MockRouter {
  navigate() {}
}

describe('ReferentielDetailComponent', () => {
  let component: ReferentielDetailComponent;
  let fixture: ComponentFixture<ReferentielDetailComponent>;
  let referentielService: ReferentielsService;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferentielDetailComponent],
      providers: [
        { provide: ReferentielsService, useClass: MockReferentielsService },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '123' })), // Simulate route params
          },
        },
        Location,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferentielDetailComponent);
    component = fixture.componentInstance;
    referentielService = TestBed.inject(ReferentielsService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load referentiel on init', () => {
    spyOn(referentielService, 'getById').and.callThrough(); // Spy on the service method
    component.ngOnInit();
    expect(referentielService.getById).toHaveBeenCalledWith('123'); // Check if service was called with correct ID
    expect(component.referentiel).toBeDefined(); // Check if referentiel is loaded
    expect(component.referentiel?.nom).toBe('Test Referentiel'); // Check loaded referentiel name
  });

  it('should add new donnees', () => {
    component.referentiel = { nom: 'Test', donnees: [] };
    component.newDonnees = 'New Data 1\nNew Data 2';
    component.addDonnees();
    expect(component.referentiel?.donnees.length).toBe(2); // Verify two new entries were added
    expect(component.referentiel?.donnees).toEqual(['New Data 1', 'New Data 2']); // Verify entries
    expect(component.newDonnees).toBe(''); // Check that input is cleared
  });

  it('should delete a donnees entry', () => {
    component.referentiel = { nom: 'Test', donnees: ['Data 1', 'Data 2'] };
    component.deleteDonnee(0);
    expect(component.referentiel?.donnees.length).toBe(1); // Verify one entry is removed
    expect(component.referentiel?.donnees).toEqual(['Data 2']); // Verify remaining entry
  });

  it('should update referentiel and go back', () => {
    spyOn(referentielService, 'updateReferentiel').and.callThrough(); // Spy on the service method
    spyOn(component, 'goBack'); // Spy on goBack method
    component.referentiel = { nom: 'Test', donnees: [] };
    component.updateReferentiel();
    expect(referentielService.updateReferentiel).toHaveBeenCalledWith(component.referentiel); // Check update call
    expect(component.goBack).toHaveBeenCalled(); // Verify goBack is called after update
  });

  it('should navigate back', () => {
    spyOn(location, 'back'); // Spy on the back method of Location
    component.goBack();
    expect(location.back).toHaveBeenCalled(); // Check if back method is called
  });
});
