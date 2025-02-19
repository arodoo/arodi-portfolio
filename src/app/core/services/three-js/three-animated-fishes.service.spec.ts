import { TestBed } from '@angular/core/testing';

import { ThreeAnimatedFishesService } from './three-animated-fishes.service';

describe('ThreeAnimatedFishesService', () => {
  let service: ThreeAnimatedFishesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeAnimatedFishesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
