import { ApplicationConfig, provideExperimentalZonelessChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { httpErrorInterceptor } from './interceptor/http-error.interceptor';
import { loadingInterceptor } from './interceptor/loading-interceptor';

function initializeApp(): void | Promise<void> {
  return inject(AuthService).init();

}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([loadingInterceptor, httpErrorInterceptor])
      , withXsrfConfiguration({
        cookieName: 'csrftoken',
        headerName: 'X-CSRFToken',
      })),
    provideAppInitializer(initializeApp),
    provideRouter(routes),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection(),
  ]
};
