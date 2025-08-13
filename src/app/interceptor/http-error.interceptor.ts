import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { NotificationSignalsService } from '../services/notification-signals.service';
import { AuthService } from '../services/auth.service';
import { SKIP_AUTH_REFRESH } from './http-context.tokens';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifyService = inject(NotificationSignalsService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 0 = Network error / CORS / aborted
      if (error.status === 0) {
        notifyService.showKey('network.offline');
        return throwError(() => error);
      }
      // 400: Validation errors (including optional reCAPTCHA field errors)
      if (error.status === 400) {
        // reCAPTCHA field specifically
        if (error.error?.recaptchaToken) {
          const messages = error.error.recaptchaToken as string[];
          notifyService.show({ type: 'error', message: messages.join(' ') });
          return throwError(() => error);
        }
        // generic field-errors dict { field: string[] }
        if (error.error && typeof error.error === 'object') {
          const backendErrors = error.error as Record<string, string[]>;
          const message = Object.values(backendErrors).flat().join('  ');
          notifyService.show({ type: 'error', message: message || 'Please check your input.' });
          return throwError(() => error);
        }
        // fallback
        notifyService.showKey('http.badRequest');
        return throwError(() => error);
      }
      // 401: Access expired - try refresh (cookie-based). If success, repeat original request.
      if (error.status === 401) {
        // Skip refresh flow for explicitly marked requests (e.g., sign-in)
        if (req.context.get(SKIP_AUTH_REFRESH)) {
          return throwError(() => error);
        }
        return authService.refreshJwtToken().pipe(
          switchMap((ok) => {
            if (ok) {
              // Cookie refreshed - simply retry the original request
              return next(req);
            }
            // no refresh possible - logout + toast
            authService.signOut();
            notifyService.showKey('auth.sessionExpired');
            return throwError(() => error);
          }),
          catchError((refreshErr) => {
            authService.signOut();
            notifyService.showKey('auth.refreshFailed');
            return throwError(() => refreshErr);
          })
        );
      }
      // 403: Let components handle domain-specific messages (e.g., account not activated)
      if (error.status === 403) {
        return throwError(() => error);
      }
      // Everything else - generic unexpected
      notifyService.showKey('http.unexpected');
      return throwError(() => error);
    })
  );
};