import { Injectable, signal } from '@angular/core';
import { CheckEmailResponse, SignUpRequest, CheckEmailRequest, SignUpResponse, User } from '../models/user.interfaces';
import { catchError, lastValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }



  // look at the app.config.ts - initializeApp()
  init(): Promise<void> {
    const init$ = this.http.get(this.getCsrfUrl,{ withCredentials: true }).pipe(
      switchMap(() => this.http.get<User>(this.currentUserUrl,{ withCredentials: true })),
      tap( user => this._user.set(user)),
      catchError(() => of(null)),
      map(() => void 0)
      )
      console.log(this.user());
      
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

  signIn() {

  }

  logout() {

  }

  checkEmailExist(data: CheckEmailRequest): Observable<CheckEmailResponse> {
    return this.http.post<CheckEmailResponse>(this.emailExistUrl, data);
  }

  getJwtToken(): string {
    return ''
  }

  refreshJwtToken(): Observable<any> {
    return this.http.post<CheckEmailResponse>(this.emailExistUrl, ''); //dummy
  }
}