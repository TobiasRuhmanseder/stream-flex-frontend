import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedIn = !!authService.user();
  console.log(authService.user());
  return loggedIn
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirectTo: state.url } });
};




