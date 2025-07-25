import { ApplicationConfig, provideExperimentalZonelessChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpAuthInterceptor } from './interceptor/http-auth.interceptor';
import { httpErrorInterceptor } from './interceptor/http-error.interceptor';

function initializeApp(): void | Promise<void> {
  const auth = inject(AuthService);
  return auth.firstRequestForAlwaysLoggedIn();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpAuthInterceptor, httpErrorInterceptor])),
    provideAppInitializer(initializeApp),
    provideRouter(routes),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection(),

  ]
};
