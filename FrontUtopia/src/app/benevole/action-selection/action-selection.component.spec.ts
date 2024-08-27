import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSelectionComponent } from './action-selection.component';

describe('ActionSelectionComponent', () => {
  let component: ActionSelectionComponent;
  let fixture: ComponentFixture<ActionSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionSelectionComponent]
    });
    fixture = TestBed.createComponent(ActionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
