import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MineursComponent } from './mineurs.component';

describe('MineursComponent', () => {
  let component: MineursComponent;
  let fixture: ComponentFixture<MineursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MineursComponent]
    });
    fixture = TestBed.createComponent(MineursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
