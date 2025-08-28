import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { SKIP_LOADING_INTCR } from './http-context.tokens';

/**
 * Intercepts HTTP requests to show a loading overlay while the request is in progress.
 * If the request context has SKIP_LOADING_INTCR, the loading overlay is not shown.
 * The loading overlay is hidden after the request completes or fails.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADING_INTCR)) return next(req);

  const loadingOverlayService = inject(LoadingOverlayService)
  loadingOverlayService.show()

  return next(req).pipe(
    finalize(() => loadingOverlayService.hide())
  );
};
