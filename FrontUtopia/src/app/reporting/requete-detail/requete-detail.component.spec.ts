import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequeteDetailComponent } from './requete-detail.component';

describe('RequeteDetailComponent', () => {
  let component: RequeteDetailComponent;
  let fixture: ComponentFixture<RequeteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequeteDetailComponent]
    });
    fixture = TestBed.createComponent(RequeteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
