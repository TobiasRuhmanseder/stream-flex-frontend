import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';


declare const grecaptcha: any;
@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private scriptId = 'recaptcha-script';
  private loaded = false;


  load(): void {
    if (!environment.recaptchaEnabled) return;
    const existing = document.getElementById(this.scriptId) as HTMLScriptElement | null;
    if (existing) {
      this.loaded = true;
      return;
    }
    const s = document.createElement('script');
    s.id = this.scriptId;
    s.src = `https://www.google.com/recaptcha/api.js?render=${environment.recaptchaSiteKey}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => {
      console.error('reCAPTCHA script cannot be loaded');
      (window as any).grecaptchaLoadFailed = true;
    };
    s.onload = () => {
      this.loaded = true;
    };
    document.head.appendChild(s);
  }

  unload(): void {
    if (!environment.recaptchaEnabled) return;
    document.querySelectorAll('.grecaptcha-badge').forEach(n => n.remove());
    const s = document.getElementById(this.scriptId);
    if (s && s.parentNode) s.parentNode.removeChild(s);
    try {
      delete (window as any).grecaptcha;
    } catch {
      (window as any).grecaptcha = undefined;
    }
    this.loaded = false;
  }


  isLoaded(): boolean {
    return this.loaded && typeof (window as any).grecaptcha !== 'undefined';
  }


  getToken(action: string): Observable<string> {
    if (!environment.recaptchaEnabled) {
      return of('');
    }
    if (!this.isLoaded()) {
      this.load();
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
      })
    })
  }
}