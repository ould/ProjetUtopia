import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLogsComponent } from './gestion-logs.component';

describe('GestionLogsComponent', () => {
  let component: GestionLogsComponent;
  let fixture: ComponentFixture<GestionLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionLogsComponent]
    });
    fixture = TestBed.createComponent(GestionLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
