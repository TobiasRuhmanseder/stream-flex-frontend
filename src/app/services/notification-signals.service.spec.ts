import { TestBed } from '@angular/core/testing';

import { NotificationSignalsService } from './notification-signals.service';

describe('NotificationSignalsService', () => {
  let service: NotificationSignalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationSignalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
