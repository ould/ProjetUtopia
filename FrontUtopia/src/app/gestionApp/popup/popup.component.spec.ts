import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<PopupComponent>>;

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [PopupComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} } // Vous pouvez définir des données de test si nécessaire
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with the correct choice', () => {
    const choice = true;
    component.close(choice);
    expect(dialogRef.close).toHaveBeenCalledWith(choice);
  });

  it('should initialize with provided data', () => {
    const testData = { title: 'Test Title', message: 'Test Message' };
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: testData });
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;

    expect(component.data).toEqual(testData);
  });
});
