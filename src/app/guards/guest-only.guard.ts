import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

/**
 * Guard that prevents logged-in users from accessing guest-only routes
 * like login or signup. If the user is already authenticated,
 * they will be redirected to the dashboard.
 *
 * Used to keep guests and authenticated users separated.
 */
export const guestOnly: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedIn = !!authService.user();

  return loggedIn ? router.createUrlTree(['/dashboard']) : true;
};