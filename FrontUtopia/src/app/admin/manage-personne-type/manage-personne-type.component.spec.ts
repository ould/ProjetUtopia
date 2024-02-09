import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePersonneTypeComponent } from './manage-personne-type.component';

describe('ManagePersonneTypeComponent', () => {
  let component: ManagePersonneTypeComponent;
  let fixture: ComponentFixture<ManagePersonneTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePersonneTypeComponent]
    });
    fixture = TestBed.createComponent(ManagePersonneTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
