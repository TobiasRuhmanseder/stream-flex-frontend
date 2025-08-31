import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, EMPTY } from 'rxjs';
import { NotificationSignalsService } from '../services/notification-signals.service';
import { AuthService } from '../services/auth.service';
import { SILENT_AUTH_CHECK } from './http-context.tokens';


/**
 * Global HTTP interceptor to handle errors like network issues, validation errors, expired sessions, and more.
 * - Shows notifications for different error types (e.g., offline, validation, session expired).
 * - Backend middleware handles token refresh automatically.
 * - If a 401 Unauthorized is received, it means the session is expired and user is signed out.
 * - Supports silent mode to suppress notifications for some requests.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifyService = inject(NotificationSignalsService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // silent auth check: prevent toast/console on unauthenticated /me
      const silent = req.context.get(SILENT_AUTH_CHECK) === true;

      // 0 = Network error / CORS / aborted
      if (error.status === 0) {
        if (silent) return EMPTY;
        notifyService.showKey('network.offline');
        return throwError(() => error);
      }
      // 400: Validation errors (including optional reCAPTCHA field errors)
      if (error.status === 400) {
        if (silent) return EMPTY;

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
      // 401: Backend middleware handles auto-refresh. If we still get 401, treat as signed-out.
      if (error.status === 401) {
        // Backend middleware handles auto-refresh. If we still get 401, treat as signed-out.
        authService.signOut();
        if (silent) return EMPTY;
        notifyService.showKey('auth.sessionExpired');
        return throwError(() => error);
      }
      // 403: Let components handle domain-specific messages (e.g., account not activated)
      if (error.status === 403) {
        return silent ? EMPTY : throwError(() => error);
      }
      // Everything else - generic unexpected
      if (!silent) {
        notifyService.showKey('http.unexpected');
        return throwError(() => error);
      }
      return EMPTY; // silent mode: swallow error completely
    })
  );
};