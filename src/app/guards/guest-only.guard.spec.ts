import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';
import { guestOnly } from './guest-only.guard';

describe('guestOnlyGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guestOnly(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
