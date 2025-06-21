import { ApplicationConfig, provideExperimentalZonelessChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';

function initializeApp(): void | Promise<void> {
  const auth = inject(AuthService);
  return auth.firstRequestForAlwaysLoggedIn();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(initializeApp),
    provideRouter(routes),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection()
  ]
};
