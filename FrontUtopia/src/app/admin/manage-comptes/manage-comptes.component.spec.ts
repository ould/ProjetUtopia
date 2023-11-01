import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageComptesComponent } from './manage-comptes.component';

describe('ManageComptesComponent', () => {
  let component: ManageComptesComponent;
  let fixture: ComponentFixture<ManageComptesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageComptesComponent]
    });
    fixture = TestBed.createComponent(ManageComptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
