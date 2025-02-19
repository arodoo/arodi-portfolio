import { TestBed } from '@angular/core/testing';

import { ThreeEarthService } from './three-earth.service';

describe('ThreeEarthService', () => {
  let service: ThreeEarthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeEarthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
