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
});
