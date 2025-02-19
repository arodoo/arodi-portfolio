import { TestBed } from '@angular/core/testing';

import { ThreeSharkServiceService } from '../three-shark-service.service';

describe('ThreeSharkServiceService', () => {
  let service: ThreeSharkServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeSharkServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
