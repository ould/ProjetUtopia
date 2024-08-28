import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReferentielsComponent } from './gestion-referentiels.component';

describe('GestionReferentielsComponent', () => {
  let component: GestionReferentielsComponent;
  let fixture: ComponentFixture<GestionReferentielsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionReferentielsComponent]
    });
    fixture = TestBed.createComponent(GestionReferentielsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
