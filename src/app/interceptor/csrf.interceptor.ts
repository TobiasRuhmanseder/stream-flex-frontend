import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const CSRF_COOKIE_NAME = 'csrftoken';
const CSRF_HEADER_NAME = 'X-CSRFToken';

/**
 * Decide robustly whether a request targets OUR API.
 * Works for both relative URLs (/api/...) and absolute URLs (https://api.streamflex.../api/...).
 * Falls back to window.location.origin for URL parsing in SSR-safe way.
 */
function isApiRequest(url: string): boolean {
  // relative /api/...
  if (url.startsWith('/api/')) return true;

  // absolute URL → parse and check host + path
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const u = new URL(url, base);

    // Allowed API hosts from env (one or many)
    const envHost = (environment as any).apiHost as string | undefined; // e.g. 'https://api.streamflex.tobias-ruhmanseder.de'
    const envHosts = (environment as any).API_HOSTS as string[] | undefined; // optional array of allowed origins

    const allowedHosts = new Set(
      [envHost, ...(envHosts ?? [])]
        .filter(Boolean) as string[]
    );

    const hostMatches = allowedHosts.size > 0 ? allowedHosts.has(u.origin) : true; // if none defined, don't block
    const pathMatches = u.pathname.startsWith('/api/');

    return hostMatches && pathMatches;
  } catch {
    return false;
  }
}

/**
 * Retrieve cookie by name.
 */
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const hit = document.cookie.split('; ').find(c => c.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.split('=')[1]) : null;
}

/**
 * HTTP interceptor that attaches CSRF tokens and enforces credentials for API requests.
 * - Always sends cookies (withCredentials) for API calls.
 * - For unsafe methods (POST, PUT, PATCH, DELETE) attaches the CSRF header from the cookie.
 */
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const toApi = isApiRequest(req.url);

  // Always send cookies for API calls (cross-site needs this)
  if (toApi && !req.withCredentials) {
    req = req.clone({ withCredentials: true });
  }

  // Add CSRF header for unsafe methods
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