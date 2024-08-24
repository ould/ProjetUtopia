import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilDetailComponent } from './profil-detail.component';

describe('ProfilDetailComponent', () => {
  let component: ProfilDetailComponent;
  let fixture: ComponentFixture<ProfilDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilDetailComponent]
    });
    fixture = TestBed.createComponent(ProfilDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
