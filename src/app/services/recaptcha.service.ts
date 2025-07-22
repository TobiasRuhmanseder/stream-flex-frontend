import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';


declare const grecaptcha: any;
@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  getToken(action: string): Observable<string> {
    if (!environment.recaptchaEnabled) {
      return of('');
    }
    if ((window as any).grecaptchaLoadFailed || typeof grecaptcha === 'undefined') {
      return throwError(() => new Error('reCAPTCHA lädt nicht – bitte versuche es später erneut.'));
    }
    return new Observable<string>(sub => {
      grecaptcha.ready(() => {
        grecaptcha.execute(environment.recaptchaSiteKey, { action })
          .then((token: string) => {
            sub.next(token);
            sub.complete();
          })
          .catch((err: any) => {
            sub.error(new Error('reCAPTCHA-Token konnte nicht erzeugt werden'));
          });
      });
    });
  }
}