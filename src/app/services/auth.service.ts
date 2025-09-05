import { Injectable, signal } from '@angular/core';
import { CheckEmailResponse, SignUpRequest, CheckEmailRequest, SignUpResponse, User, SignInRequest, SignInResponse, PasswordResetConfirmRequest, PasswordResetRequest } from '../models/user.interfaces';
import { catchError, lastValueFrom, map, mapTo, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpContext } from '@angular/common/http';
import { SKIP_LOGOUT, SILENT_AUTH_CHECK, SKIP_LOADING_INTCR } from '../interceptor/http-context.tokens';

const STORAGE_KEY = 'sf_maybeLoggedIn';


// =================http-context's Info========================
// SILENT_AUTH_CHECK: no toast/console on unauthenticated /me
// SKIP_AUTH_REFRESH: do not attempt interceptor refresh for this request
// SKIP_LOADING_INTCR: do not attempt interceptor loading for this request
//look at the interceptor/http-error.tokens.ts file for more informations

@Injectable({
  providedIn: 'root'
})


/**
 * AuthService handles authentication, session management, and user state.
 * It manages login, logout, sign-up, user info, and keeps session hints in sync.
 */
export class AuthService {
  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  maybeLoggedIn = signal<boolean>(localStorage.getItem(STORAGE_KEY) === '1');

  private base = environment.apiBaseUrl;
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


  /**
   * Syncs the maybeLoggedIn hint with localStorage and across tabs.
   * Keeps login state consistent between browser tabs.
   */
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

  /**
   * Marks the user as logged in after successful sign-in.
   * Updates localStorage and maybeLoggedIn signal.
   */
  markLoggedInHint(): void {
    this.maybeLoggedIn.set(true);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { }
  }

  /**
   * Clears the logged-in hint on sign-out or session end.
   * Updates localStorage and maybeLoggedIn signal.
   */
  clearLoggedInHint(): void {
    this.maybeLoggedIn.set(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
  }


  /**
   * Initializes authentication state on app start.
   * Gets CSRF token and user info if maybe logged in.
   * look at the app.config.ts - initializeApp()
   */
  // 
  init(): Promise<void> {
    const silentCtx = new HttpContext().set(SILENT_AUTH_CHECK, true);
    const csrf$ = this.http.get(this.getCsrfUrl, { withCredentials: true });
    const maybeMe$ = this.maybeLoggedIn()
      ? this.http.get<User>(this.geMeUrl, { withCredentials: true, context: silentCtx }).pipe(
        tap(user => this._user.set(user)),
        map(() => void 0),
        catchError(() => {
          console.log('deleted');
          
          this._user.set(null);
          this.maybeLoggedIn.set(false);
          try { localStorage.removeItem(STORAGE_KEY); } catch { }
          return of(void 0);
        })
      )
      : of(void 0);

    const init$ = csrf$.pipe(switchMap(() => maybeMe$));
    return lastValueFrom(init$);
  }

  /**
   * Ensures user info is loaded.
   * Gets user from signal or fetches from backend.
   */
  ensureUser(): Observable<User | null> {
    const user = this._user();
    if (user) return of(user)

    return this.http.get<User>(this.geMeUrl, { withCredentials: true }).pipe(
      tap(user => this._user.set(user)), catchError(() => of(null)))
  }

  /**
   * Registers a new user with provided sign-up data.
   */
  signUp(data: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(this.signUpUrl, data)
  }

  /**
   * Signs in the user with credentials.
   * Sets user state and marks as logged in.
   */
  signIn(data: SignInRequest): Observable<SignInResponse> {
    const ctx = new HttpContext().set(SKIP_LOGOUT, true);

    return this.http.post<SignInResponse>(this.signInUrl, data, { withCredentials: true, context: ctx }).pipe(
      tap(res => { this._user.set(res.user); this.markLoggedInHint(); })
    );
  }


  /**
   * Logs out the user on the server and clears local user state.
   * Reloads the page. Used by interceptors.
   */
  signOut(): void {
    this.clearLoggedInHint();
    const ctx = new HttpContext().set(SKIP_LOGOUT, true);
    this.http.post(this.signOutUrl, {}, { withCredentials: true, context: ctx }).subscribe({
      next: () => { },
      error: () => {
        this._user.set(null);
        window.location.reload();
      },
      complete: () => {
        this._user.set(null);
        window.location.reload();
      },
    });
  }

  /**
   * Clears user state locally without calling the backend.
   * Used when refresh fails or session is lost.
   */
  forceLogoutLocal(): void {
    this._user.set(null);
    this.clearLoggedInHint();
  }

  /**
   * Checks if an email already exists.
   */
  checkEmailExist(data: CheckEmailRequest): Observable<CheckEmailResponse> {
    return this.http.post<CheckEmailResponse>(this.emailExistUrl, data);
  }

  /**
   * Requests a password reset for a given email.
   */
  passwordResetRequest(data: PasswordResetRequest) {
    return this.http.post<void>(this.passwordResetUrl, data, { withCredentials: true });
  }

  /**
   * Confirms password reset with new password and token.
   */
  passwordResetConfirm(data: PasswordResetConfirmRequest) {
    return this.http.post<void>(this.passwordResetConfirmUrl, data, { withCredentials: true });
  }

  /**
   * Verifies user email with the provided token.
   */
  verifyEmail(token: string) {
    const params = new HttpParams().set('token', token);
    return this.http.get<void>(this.verifyEmailUrl, { params, withCredentials: true });
  }

  /**
   * Resends the verification email to the given address.
   */
  resendVerificaton(email: string) {
    return this.http.post(this.resendVerifyEmailUrl, { email }, { withCredentials: true });
  }

}