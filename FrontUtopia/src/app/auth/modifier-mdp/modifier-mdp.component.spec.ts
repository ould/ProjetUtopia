import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierMdpComponent } from './modifier-mdp.component';

describe('ModifierMdpComponent', () => {
  let component: ModifierMdpComponent;
  let fixture: ComponentFixture<ModifierMdpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierMdpComponent]
    });
    fixture = TestBed.createComponent(ModifierMdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
