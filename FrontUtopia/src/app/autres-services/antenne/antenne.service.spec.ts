import { TestBed } from '@angular/core/testing';

import { AntenneService } from './antenne.service';

describe('AntenneService', () => {
  let service: AntenneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntenneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
