import { Injectable, signal } from '@angular/core';
import { CheckEmailResponse, SignUpRequest, CheckEmailRequest, SignUpResponse, User, SignInRequest, SignInResponse, PasswordResetConfirmRequest, PasswordResetRequest } from '../models/user.interfaces';
import { catchError, lastValueFrom, map, mapTo, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpContext } from '@angular/common/http';
import { SKIP_AUTH_REFRESH, SILENT_AUTH_CHECK, SKIP_LOADING_INTCR } from '../interceptor/http-context.tokens';

const STORAGE_KEY = 'sf_maybeLoggedIn';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // =================http-context's Info========================

  // SILENT_AUTH_CHECK: no toast/console on unauthenticated /me
  // SKIP_AUTH_REFRESH: do not attempt interceptor refresh for this request
  // SKIP_LOADING_INTCR: do not attempt interceptor loading for this request
  //look at the interceptor/http-error.tokens.ts file for more informations

  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  maybeLoggedIn = signal<boolean>(localStorage.getItem(STORAGE_KEY) === '1');

  private base = environment.apiBaseUrl;         // z.B. 'http://localhost:8000/api'
  private signUpUrl = `${this.base}/users/signup/`;
  private emailExistUrl = `${this.base}/users/check-email/`;
  private geMeUrl = `${this.base}/users/me/`;
  private getCsrfUrl = `${this.base}/users/csrf/`;
  private signInUrl = `${this.base}/users/sign-in/`;
  private signOutUrl = `${this.base}/users/sign-out/`;
  private tokenRefreshUrl = `${this.base}/users/token-refresh/`;
  private verifyEmailUrl = `${this.base}/users/verify-email/`;
  private resendVerifyEmailUrl = `${this.base}/users/resend-verification/`;
  private passwordResetUrl = `${this.base}/users/password-reset/`;
  private passwordResetConfirmUrl = `${this.base}/users/password-reset/confirm/`;

  constructor(private http: HttpClient) {
    this.storageSync();
  }


  /** Syncs the maybeLoggedIn hint with localStorage and across tabs. */
  storageSync(): void {
    // initialize from localStorage
    try {
      const v = localStorage.getItem(STORAGE_KEY) === '1';
      this.maybeLoggedIn.set(v);
    } catch { }

    // cross-tab sync
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        const nv = e.newValue === '1';
        this.maybeLoggedIn.set(nv);
        if (!nv) this._user.set(null);
      }
    });
  }

  /** Mark hint after successful sign-in. */
  markLoggedInHint(): void {
    this.maybeLoggedIn.set(true);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { }
  }

  /** Clear hint on sign-out or when session is gone. */
  clearLoggedInHint(): void {
    this.maybeLoggedIn.set(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
  }


  // look at the app.config.ts - initializeApp()
  init(): Promise<void> {
    const silentCtx = new HttpContext().set(SILENT_AUTH_CHECK, true);
    const csrf$ = this.http.get(this.getCsrfUrl, { withCredentials: true });
    const maybeMe$ = this.maybeLoggedIn()
      ? this.http.get<User>(this.geMeUrl, { withCredentials: true, context: silentCtx }).pipe(
        tap(user => this._user.set(user)),
        catchError(() => of(null)),
        map(() => void 0)
      )
      : of(void 0);
    const init$ = csrf$.pipe(switchMap(() => maybeMe$));
    return lastValueFrom(init$);
  }

  ensureUser(): Observable<User | null> {
    const user = this._user();
    if (user) return of(user)

    return this.http.get<User>(this.geMeUrl, { withCredentials: true }).pipe(
      tap(user => this._user.set(user)), catchError(() => of(null)))
  }

  signUp(data: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(this.signUpUrl, data)
  }

  signIn(data: SignInRequest): Observable<SignInResponse> {
    const context = new HttpContext().set(SKIP_AUTH_REFRESH, true);

    return this.http.post<SignInResponse>(this.signInUrl, data, { withCredentials: true, context }).pipe(
      tap(res => { this._user.set(res.user); this.markLoggedInHint(); })
    );
  }

  ensureFreshAccessWithoutLoadingIntcr(): Observable<void> {
    const context = new HttpContext().set(SKIP_LOADING_INTCR, true);

    return this.http.get(this.geMeUrl, { withCredentials: true, context })
      .pipe(
        map(() => undefined),
        catchError(() => of(undefined))
      );
  }
  /**
   * Logs out on the server (deletes cookies) and clears the local user signal.
   * This method self-subscribes because it is often called from interceptors.
   */
  signOut(): void {
    this.clearLoggedInHint();
    const context = new HttpContext().set(SKIP_AUTH_REFRESH, true);
    this.http.post(this.signOutUrl, {}, { withCredentials: true, context }).subscribe({
      next: () => { },
      error: () => {
      },
      complete: () => {
        this._user.set(null);
        window.location.reload();
      },
    });
  }

  /** Clears user state locally without calling the backend (used when refresh fails). */
  forceLogoutLocal(): void {
    this._user.set(null);
    this.clearLoggedInHint();
  }

  checkEmailExist(data: CheckEmailRequest): Observable<CheckEmailResponse> {
    return this.http.post<CheckEmailResponse>(this.emailExistUrl, data);
  }

  passwordResetRequest(data: PasswordResetRequest) {
    return this.http.post<void>(this.passwordResetUrl, data, { withCredentials: true });
  }

  passwordResetConfirm(data: PasswordResetConfirmRequest) {
    return this.http.post<void>(this.passwordResetConfirmUrl, data, { withCredentials: true });
  }

  /**
   * Tries to refresh the access token using HttpOnly cookies.
   * Returns true on success, false on failure.
   */
  refreshJwtToken(): Observable<boolean> {
    const context = new HttpContext().set(SKIP_AUTH_REFRESH, true);

    return this.http.post(this.tokenRefreshUrl, {}, { withCredentials: true, context }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  verifyEmail(token: string) {
    const params = new HttpParams().set('token', token);
    return this.http.get<void>(this.verifyEmailUrl, { params, withCredentials: true });
  }

  resendVerificaton(email: string) {
    return this.http.post(this.resendVerifyEmailUrl, { email }, { withCredentials: true });
  }

}