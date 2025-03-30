import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMaraudeComponent } from './form-maraude.component';

describe('FormMaraudeComponent', () => {
  let component: FormMaraudeComponent;
  let fixture: ComponentFixture<FormMaraudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMaraudeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMaraudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
