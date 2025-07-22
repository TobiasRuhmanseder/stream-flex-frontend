import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}
else console.log('dev - mode enable - look at the main.ts and environment.ts file');

if (environment.recaptchaEnabled) {
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptch/api.js?render=${environment.recaptchaSiteKey}`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    console.error('reCAPTCHA-Script can not be loaded');
    (window as any).grecaptchaLoadFailed = true;
  };
  document.head.appendChild(script);
}


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
