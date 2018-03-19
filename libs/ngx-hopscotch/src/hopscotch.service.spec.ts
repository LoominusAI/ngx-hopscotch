import { TestBed, inject } from '@angular/core/testing';

import { HopscotchService } from './hopscotch.service';

describe('HopscotchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HopscotchService]
    });
  });

  it(
    'should be created',
    inject([HopscotchService], (service: HopscotchService) => {
      expect(service).toBeTruthy();
    })
  );
});
