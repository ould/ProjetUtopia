import { TestBed } from '@angular/core/testing';
import { ErreurService } from './erreur.service';

describe('ErreurService', () => {
  let service: ErreurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErreurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get an error message', (done: DoneFn) => {
    const errorMessage = 'An error occurred';
    service.setErreur(errorMessage);

    service.getErreur().subscribe(message => {
      expect(message).toBe(errorMessage);
      done();
    });
  });

  it('should clear the error message', (done: DoneFn) => {
    service.setErreur('An error occurred');
    service.clearErreur();

    service.getErreur().subscribe(message => {
      expect(message).toBeNull();
      done();
    });
  });
});
