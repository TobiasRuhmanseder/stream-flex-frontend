import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, from, Observable, of, switchMap } from 'rxjs';


declare const grecaptcha: any;  
@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
 private apiUrl = `https://www.google.com/recaptcha/api.js?render=${environment.recaptchaSiteKey}`;
  private scriptLoaded = false;


  getToken(action: string): Observable<string> {
    if (!environment.recaptchaEnabled) {
      return of('');
    }
    // 1. script load (if not already done ), then execute
    return from(this.loadScript()).pipe(
      switchMap(() =>
        new Observable<string>(subscriber => {
          grecaptcha.ready(() => {
            grecaptcha.execute(environment.recaptchaSiteKey, { action })
              .then((token: string) => subscriber.next(token))
              .catch(() => subscriber.next(''))
              .finally(() => subscriber.complete());
          });
        })
      ),
      catchError(() => of(''))
    );
  }

  /**
   * load the reCAPTCHA-Script in the DOM for one time.
   */
  private loadScript(): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.apiUrl;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject(`Failed to load ${this.apiUrl}`);
      document.head.appendChild(script);
    });
  }
}