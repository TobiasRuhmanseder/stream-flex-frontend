import { Injectable, signal } from '@angular/core';
import { CheckEmailResponse, SignUpRequest, CheckEmailRequest, SignUpResponse, User, SignInRequest, SignInResponse } from '../models/user.interfaces';
import { catchError, lastValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  private ensureUser$?: Observable<User | null>;

  private base = environment.apiBaseUrl;         // z.B. 'http://localhost:8000/api'
  private signUpUrl = `${this.base}/users/signup/`;
  private emailExistUrl = `${this.base}/users/check-email/`;
  private currentUserUrl = `${this.base}/users/me/`;
  private getCsrfUrl = `${this.base}/users/csrf/`;
  private signInUrl = `${this.base}/users/sign-in/`;
  private signOutUrl = `${this.base}/users/sign-out/`;
  private tokenRefreshUrl = `${this.base}/users/token-refresh/`;

  constructor(private http: HttpClient, private router: Router) { }



  // look at the app.config.ts - initializeApp()
  init(): Promise<void> {
    const init$ = this.http.get(this.getCsrfUrl, { withCredentials: true }).pipe(
      switchMap(() => this.http.get<User>(this.currentUserUrl, { withCredentials: true })),
      tap(user => this._user.set(user)),
      catchError(() => of(null)),
      map(() => void 0)
    )


    return lastValueFrom(init$);
  }

  ensureUser(): Observable<User | null> {
    const user = this._user();
    if (user) return of(user)

    return this.http.get<User>(this.currentUserUrl, { withCredentials: true }).pipe(
      tap(user => this._user.set(user)), catchError(() => of(null)))
  }

  signUp(data: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(this.signUpUrl, data)
  }

  signIn(data: SignInRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(this.signInUrl, data, { withCredentials: true }).pipe(
      tap(res => this._user.set(res.user))
    );
  }

  /**
   * Logs out on the server (deletes cookies) and clears the local user signal.
   * This method self-subscribes because it is often called from interceptors.
   */
  signOut(): void {
    this.http.post(this.signOutUrl, {}, { withCredentials: true }).subscribe({
      next: () => { },
      error: () => { },
      complete: () => {
        this._user.set(null);
        this.router.navigate(['/login']);

      },
    });
  }

  /** Clears user state locally without calling the backend (used when refresh fails). */
  forceLogoutLocal(): void {
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  checkEmailExist(data: CheckEmailRequest): Observable<CheckEmailResponse> {
    return this.http.post<CheckEmailResponse>(this.emailExistUrl, data);
  }

  /**
   * Tries to refresh the access token using HttpOnly cookies.
   * Returns true on success, false on failure.
   */
  refreshJwtToken(): Observable<boolean> {
    return this.http.post(this.tokenRefreshUrl, {}, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}