import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


export const guestOnly: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedIn = !!authService.user();
  return loggedIn ? router.createUrlTree(['/dashboard']) : true;
};