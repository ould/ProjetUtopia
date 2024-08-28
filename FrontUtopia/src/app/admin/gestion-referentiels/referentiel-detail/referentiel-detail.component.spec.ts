import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferentielDetailComponent } from './referentiel-detail.component';

describe('ReferentielDetailComponent', () => {
  let component: ReferentielDetailComponent;
  let fixture: ComponentFixture<ReferentielDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferentielDetailComponent]
    });
    fixture = TestBed.createComponent(ReferentielDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
