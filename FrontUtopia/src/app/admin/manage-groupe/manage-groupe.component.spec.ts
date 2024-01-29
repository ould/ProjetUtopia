import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupeComponent } from './manage-groupe.component';

describe('ManageGroupeComponent', () => {
  let component: ManageGroupeComponent;
  let fixture: ComponentFixture<ManageGroupeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageGroupeComponent]
    });
    fixture = TestBed.createComponent(ManageGroupeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
