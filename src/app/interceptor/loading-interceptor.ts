import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { SKIP_LOADING_INTCR } from './http-context.tokens';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (SKIP_LOADING_INTCR) return next(req);

  const loadingOverlayService = inject(LoadingOverlayService)
  loadingOverlayService.show()

  return next(req).pipe(
    finalize(() => loadingOverlayService.hide())
  );
};
