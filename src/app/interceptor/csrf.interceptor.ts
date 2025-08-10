
import { HttpInterceptorFn } from '@angular/common/http';

// API targets (Dev + Prod). Adjust the prod URL to your domain.
const API_PREFIXES = [
  '/api',                        // Dev-Proxy / Reverse-Proxy
  'http://localhost:8000',      // Direct dev backend
  'https://api.example.com',    // TODO: replace with your prod API
];

const CSRF_COOKIE_NAME = 'csrftoken';
const CSRF_HEADER_NAME = 'X-CSRFToken';

function readCookie(name: string): string | null {
  const hit = document.cookie.split('; ').find(c => c.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.split('=')[1]) : null;
}

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
