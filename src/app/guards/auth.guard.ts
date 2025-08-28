import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

/**
 * Guard that checks if the user is logged in before allowing navigation.
 * If the user is not authenticated, redirects to the login page with a `redirectTo` query parameter
 * containing the attempted URL.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedIn = !!authService.user();
  return loggedIn
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirectTo: state.url } });
};




