import { HttpInterceptorFn } from '@angular/common/http';



export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const isApi = req.url.startsWith('/api/');             // nur unsere API
  let r = req;
  if (isApi && !r.withCredentials) r = r.clone({ withCredentials: true });

  const unsafe = /^(POST|PUT|PATCH|DELETE)$/i.test(r.method);
  if (isApi && unsafe) {
    const t = document.cookie.split('; ')
      .find(c => c.startsWith('csrftoken='))?.split('=')[1];
    if (t) r = r.clone({ setHeaders: { 'X-CSRFToken': t } });
  }
  return next(r);
};




















// function isApi(url: string): boolean {
//   if (url.startsWith('/api/')) return true;
//   try {
//     const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
//     const u = new URL(url, base);
//     const host = (environment as any).apiHost as string | undefined;
//     const hosts = (environment as any).API_HOSTS as string[] | undefined;
//     const allowed = new Set([host, ...(hosts ?? [])].filter(Boolean) as string[]);
//     const hostOk = allowed.size ? allowed.has(u.origin) : true;
//     return hostOk && u.pathname.startsWith('/api/');
//   } catch { return false; }
// }




// function readCookie(name: string): string | null {
//   if (typeof document === 'undefined') return null;
//   const hit = document.cookie.split('; ').find(c => c.startsWith(name + '='));
//   return hit ? decodeURIComponent(hit.split('=')[1]) : null;
// }
// export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
//   const toApi = isApi(req.url);
//   if (toApi && !req.withCredentials) req = req.clone({ withCredentials: true });
//   const unsafe = /^(POST|PUT|PATCH|DELETE)$/i.test(req.method);
//   if (toApi && unsafe && !req.headers.has(CSRF_HEADER_NAME)) {
//     const token = readCookie(CSRF_COOKIE_NAME);
//     if (token) req = req.clone({ setHeaders: { [CSRF_HEADER_NAME]: token } });
//   }
//   return next(req);
// };
// const CSRF_COOKIE_NAME = 'csrftoken';
// const CSRF_HEADER_NAME = 'X-CSRFToken';

// /**
//  * Decide robustly whether a request targets OUR API.
//  * Works for both relative URLs (/api/...) and absolute URLs (https://api.streamflex.../api/...).
//  * Falls back to window.location.origin for URL parsing in SSR-safe way.
//  */
// function isApiRequest(url: string): boolean {
//   // relative /api/...
//   if (url.startsWith('/api/')) return true;

//   // absolute URL → parse and check host + path
//   try {
//     const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
//     const u = new URL(url, base);

//     // Allowed API hosts from env (one or many)
//     const envHost = (environment as any).apiHost as string | undefined; // e.g. 'https://api.streamflex.tobias-ruhmanseder.de'
//     const envHosts = (environment as any).API_HOSTS as string[] | undefined; // optional array of allowed origins

//     const allowedHosts = new Set(
//       [envHost, ...(envHosts ?? [])]
//         .filter(Boolean) as string[]
//     );

//     const hostMatches = allowedHosts.size > 0 ? allowedHosts.has(u.origin) : true; // if none defined, don't block
//     const pathMatches = u.pathname.startsWith('/api/');

//     return hostMatches && pathMatches;
//   } catch {
//     return false;
//   }
// }

// /**
//  * Retrieve cookie by name.
//  */
// function readCookie(name: string): string | null {
//   if (typeof document === 'undefined') return null;
//   const hit = document.cookie.split('; ').find(c => c.startsWith(name + '='));
//   return hit ? decodeURIComponent(hit.split('=')[1]) : null;
// }

// /**
//  * HTTP interceptor that attaches CSRF tokens and enforces credentials for API requests.
//  * - Always sends cookies (withCredentials) for API calls.
//  * - For unsafe methods (POST, PUT, PATCH, DELETE) attaches the CSRF header from the cookie.
//  */
// export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
//   const toApi = isApiRequest(req.url);

//   // Always send cookies for API calls (cross-site needs this)
//   if (toApi && !req.withCredentials) {
//     req = req.clone({ withCredentials: true });
//   }

//   // Add CSRF header for unsafe methods
//   const method = req.method.toUpperCase();
//   const unsafe = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';

//   if (toApi && unsafe && !req.headers.has(CSRF_HEADER_NAME)) {
//     const token = readCookie(CSRF_COOKIE_NAME);
//     if (token) {
//       req = req.clone({ setHeaders: { [CSRF_HEADER_NAME]: token } });
//     }
//   }

//   return next(req);
// };



// -------------------




// import { HttpInterceptorFn } from '@angular/common/http';
// import { environment } from 'src/environments/environment';

// // API targets (Dev + Prod). Adjust the prod URL to your domain.
// const API_PREFIXES = environment.API_PREFIXES;

// const CSRF_COOKIE_NAME = 'csrftoken';
// const CSRF_HEADER_NAME = 'X-CSRFToken';


// /**
//  * HTTP interceptor that attaches CSRF tokens and enforces credentials for API requests.
//  * For requests to API endpoints, it ensures cookies are sent with credentials.
//  * For unsafe HTTP methods (POST, PUT, PATCH, DELETE), it attaches the CSRF token from cookies to the appropriate header.
//  */
// export const csrfInterceptor: HttpInterceptorFn = (req, next) => {

//   const toApi = API_PREFIXES.some(p => req.url.startsWith(p));
//   // Always send cookies for API calls
//   if (toApi && !req.withCredentials) {
//     req = req.clone({ withCredentials: true });
//   }

//   // Attach CSRF header only for unsafe methods
//   const method = req.method.toUpperCase();
//   const unsafe = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';

//   if (toApi && unsafe && !req.headers.has(CSRF_HEADER_NAME)) {
//     const token = readCookie(CSRF_COOKIE_NAME);
//     if (token) {
//       req = req.clone({ setHeaders: { [CSRF_HEADER_NAME]: token } });
//     }
//   }
//   return next(req);
// };



// /**
//  * Retrieves the value of a specific cookie by name.
//  * @param name The name of the cookie to retrieve.
//  * @returns The value of the cookie, or null if not found.
//  */
// function readCookie(name: string): string | null {
//   const hit = document.cookie.split('; ').find(c => c.startsWith(name + '='));
//   return hit ? decodeURIComponent(hit.split('=')[1]) : null;
// }