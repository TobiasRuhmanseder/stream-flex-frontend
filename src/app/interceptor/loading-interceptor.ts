import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingOverlayService } from '../services/loading-overlay.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingOverlayService = inject(LoadingOverlayService)
  loadingOverlayService.show()

  return next(req).pipe(
    finalize(() => loadingOverlayService.hide())
  );
};
