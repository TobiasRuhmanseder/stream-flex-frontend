
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// API targets (Dev + Prod). Adjust the prod URL to your domain.
const API_PREFIXES = environment.API_PREFIXES;

const CSRF_COOKIE_NAME = 'csrftoken';
const CSRF_HEADER_NAME = 'X-CSRFToken';


/**
 * HTTP interceptor that attaches CSRF tokens and enforces credentials for API requests.
 * For requests to API endpoints, it ensures cookies are sent with credentials.
 * For unsafe HTTP methods (POST, PUT, PATCH, DELETE), it attaches the CSRF token from cookies to the appropriate header.
 */
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {

  const toApi = API_PREFIXES.some(p => req.url.startsWith(p));
  // Always send cookies for API calls
  if (toApi && !req.withCredentials) {
    req = req.clone({ withCredentials: true });
  }

  // Attach CSRF header only for unsafe methods
  const method = req.method.toUpperCase();
  const unsafe = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';

  if (toApi && unsafe && !req.headers.has(CSRF_HEADER_NAME)) {
    const token = readCookie(CSRF_COOKIE_NAME);
    if (token) {
      req = req.clone({ setHeaders: { [CSRF_HEADER_NAME]: token } });
    }
  }
  return next(req);
};



/**
 * Retrieves the value of a specific cookie by name.
 * @param name The name of the cookie to retrieve.
 * @returns The value of the cookie, or null if not found.
 */
function readCookie(name: string): string | null {
  const hit = document.cookie.split('; ').find(c => c.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.split('=')[1]) : null;
}