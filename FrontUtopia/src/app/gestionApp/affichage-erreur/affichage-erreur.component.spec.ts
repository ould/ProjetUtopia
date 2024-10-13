import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageErreurComponent } from './affichage-erreur.component';

describe('AffichageErreurComponent', () => {
  let component: AffichageErreurComponent;
  let fixture: ComponentFixture<AffichageErreurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffichageErreurComponent]
    });
    fixture = TestBed.createComponent(AffichageErreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
