import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();


}
else console.log('dev - mode enable - look at the main.ts and environment.ts file');


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
