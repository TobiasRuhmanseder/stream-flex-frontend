import { TestBed } from '@angular/core/testing';

import { MovieOverlayInfoService } from './movie-overlay-info.service';

describe('MovieOverlayInfoService', () => {
  let service: MovieOverlayInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieOverlayInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
