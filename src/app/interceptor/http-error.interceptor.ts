import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { NotificationSignalsService } from '../services/notification-signals.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationSignalsService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 400) {
        const backendErrors = error.error as { [field: string]: string[] }
        const messages = Object.values(backendErrors).flat().join('  ');
        notificationService.show({ type: 'error', message: messages })
      }
      else if (error.status === 400 && error.error?.recaptchaToken) {
        const messages = error.error.recaptchaToken as string[];
        notificationService.show({ message: messages.join(' '), type: 'error' })
      }
      else if (error.status === 401) {
        return authService.refreshJwtToken().pipe(
          switchMap(newToken => {
            if (newToken) {
              const authReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(authReq);
            }
            // no refresh-token or failure → Logout
            authService.logout();
            notificationService.show({ message: 'Session expired. Please log in again.', type: 'error' });
            return throwError(() => error);
          }),
          catchError(refreshErr => {
            // refresh failure
            authService.logout();
            notificationService.show({ message: 'Unable to refresh session. Please log in again.', type: 'error' });
            return throwError(() => refreshErr);
          })
        );
      }
      else {
        notificationService.show({ message: 'Your session has expired. Please log in again.', type: 'error' });
      }
      return throwError(() => error);
    })
  )
}



