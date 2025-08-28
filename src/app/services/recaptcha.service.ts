import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';

declare const grecaptcha: any;

/**
 * Service to handle loading and using Google reCAPTCHA.
 * It loads the reCAPTCHA script, unloads it, checks if it's ready, and gets tokens.
 */
@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private scriptId = 'recaptcha-script';
  private loaded = false;

  /**
   * Loads the reCAPTCHA script if it's not already loaded and enabled in the environment.
   * It adds the script tag to the document head and sets up error handling.
   */
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

  /**
   * Unloads the reCAPTCHA script and related elements from the page.
   * Also cleans up the global grecaptcha object and resets the loaded state.
   */
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


  /**
   * Checks if the reCAPTCHA script is loaded and ready to use.
   * @returns true if loaded and grecaptcha is defined, false otherwise.
   */
  isLoaded(): boolean {
    return this.loaded && typeof (window as any).grecaptcha !== 'undefined';
  }


  /**
   * Gets a reCAPTCHA token for the given action.
   * If reCAPTCHA is disabled, returns an empty string.
   * If not loaded, tries to load it first.
   * Returns an Observable that emits the token or an error if something goes wrong.
   * @param action The action name to pass to grecaptcha.execute.
   */
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