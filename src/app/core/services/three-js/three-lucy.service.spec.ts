import { TestBed } from '@angular/core/testing';

import { ThreeLucyService } from './three-lucy.service';

describe('ThreeLucyService', () => {
  let service: ThreeLucyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeLucyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
