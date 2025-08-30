import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api/')) {
    const host = environment.apiHost || ''; // 
    return next(req.clone({ url: `${host}${req.url}` }));
  }
  return next(req);
};
