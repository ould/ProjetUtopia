import { TestBed } from '@angular/core/testing';

import { TypePersonneService } from './type.service';

describe('TypeService', () => {
  let service: TypePersonneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypePersonneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
